import { EventEmitter } from "fbemitter"
import Config from "./Config"
import Interval from "./Interval"

export default class Timer extends EventEmitter {
    constructor (config) {
        super()

        this.config = new Config(config)

        this.interval = new Interval
        this.interval.addListener('tick', () => this.tick())

        this.props = {
            session: {
                started: null,
                elapsed: 0,
                offset: 0
            },
            set: {
                index: 0,
                elapsed: 0,
                offset: 0
            },
            phase: {
                index: 0,
                elapsed: 0,
                offset: 0
            },
            state: null
        }

        this.state = Timer.states.READY
    }
    static get states () {
        return {
            READY: 0,
            STARTED: 1,
            PAUSED: 2,
            STOPPED: 4
        }
    }
    set state (state) {
        let value = null

        switch (state) {
            case Timer.states.STARTED:
                value = Timer.states.READY | Timer.states.STARTED
                break
            case Timer.states.PAUSED:
                value = Timer.states.READY | Timer.states.STARTED | Timer.states.PAUSED
                break
            case Timer.states.STOPPED:
                value = Timer.states.READY | Timer.states.STARTED | Timer.states.PAUSED | Timer.states.STOPPED
                break
            case Timer.states.READY:
            default:
                value = Timer.states.READY
                break
        }

        this.props.state = value
    }
    is (state) {
        return (this.props.state & state) === state
    }
    emitEvents () {
        let events = this.config.getEvents(this.props.session, this.props.set, this.props.phase)

        let sessionFinished = false
        let phaseFinished = false
        for (const event of events) {
            let eventName = event.data.attributes.name

            if (eventName === 'session.finished') {
                setTimeout(() => this.stop(), 0)
                sessionFinished = true
            }

            if (eventName === 'set.finished') {
                this.props.set = {
                    index: event.meta.set + 1,
                    elapsed: 0,
                    offset: 0
                }
            }

            if (eventName === 'phase.finished') {
                this.props.phase = {
                    index: event.meta.phase + 1,
                    elapsed: 0,
                    offset: 0
                }
                phaseFinished = true
            }

            this.emit(eventName, event)
        }

        if (!sessionFinished && phaseFinished) this.emitEvents()
    }
    tick () {
        this.props.session.elapsed++
        this.props.set.elapsed++
        this.props.phase.elapsed++
        this.emit('ticked')
        this.emitEvents()
    }
    start () {
        if (this.is(Timer.states.READY) && !this.is(Timer.states.STOPPED)) {
            this.props.session.started = Date.now()
            this.interval.start()
            this.state = Timer.states.STARTED
            this.emit('started')
            this.emitEvents()
        }
    }
    pause () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.PAUSED)) {
            this.interval.pause()
            this.state = Timer.states.PAUSED
            this.emit('paused')
        }
    }
    skip () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.STOPPED)) {
            let phase = this.config.phases[this.props.phase.index]
            let offset = phase.duration - this.props.phase.elapsed
            this.props.session.offset += offset
            this.props.set.offset += offset
            this.props.phase.offset += offset
            this.emit('skipped')
            this.emitEvents(offset)
        }
    }
    stop () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.STOPPED)) {
            this.interval.stop()
            this.state = Timer.states.STOPPED
            this.emit('stopped')
        }
    }
    reset () {
        if (this.is(Timer.states.STARTED)) {
            this.stop()
            this.props.session.started = null
            this.props.session.elapsed = 0
            this.state = Timer.states.READY
            this.emit('reset')
        }
    }
}