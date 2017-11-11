import { EventEmitter } from "fbemitter"
import Config from "./Config"
import Interval from "./Interval"

export default class Timer extends EventEmitter {
    constructor (config) {
        super()

        this.config = new Config(config)

        this.interval = new Interval
        this.interval.addListener('tick', () => this.tick())

        this.init()
    }
    init () {
        this.config.init()

        this.props = {
            session: {
                started: null,
                elapsed: 0,
            },
            set: {
                index: 0,
                elapsed: 0,
            },
            phase: {
                index: 0,
                elapsed: 0,
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
        let setFinished = false
        let phaseFinished = false

        for (const event of events) {
            let eventName = event.data.attributes.name

            if (eventName === 'session.finished') sessionFinished = true
            if (eventName === 'set.finished') setFinished = true
            if (eventName === 'phase.finished') phaseFinished = true

            this.emit(eventName, event)
        }

        if (sessionFinished) return setTimeout(() => this.stop(), 0)

        if (setFinished) {
            this.props.set.index++
            this.props.set.elapsed = 0
            this.props.set.offset = 0

            this.props.phase.index = 0
            this.props.phase.elapsed = 0
            this.props.phase.offset = 0
        } else if (phaseFinished) {
            this.props.phase.index++
            this.props.phase.elapsed = 0
            this.props.phase.offset = 0
        }

        events = this.config.getEvents(
            null,
            setFinished ? this.props.set : null,
            phaseFinished ? this.props.phase : null
        )

        for (const event of events) {
            let eventName = event.data.attributes.name
            this.emit(eventName, event)
        }
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
            let phase = this.config.getPhase(this.props.set, this.props.phase)
            let adjustment = this.props.phase.elapsed - phase.duration
            let nextPhaseIndex = this.props.phase.index + 1
            let nextPhase = this.config.phases[nextPhaseIndex]
            if (nextPhase) {
                this.config.adjustPhase(nextPhase.set, nextPhaseIndex, adjustment)
            }
            this.props.phase.elapsed = phase.duration
            this.emit('skipped')
            this.emitEvents()
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
            this.init()
            this.emit('reset')
        }
    }
}