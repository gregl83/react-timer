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
            started: null,
            elapsed: 0,
            skipped: 0,
            phaseEndTime: 0,
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
        let events = this.config.getEvents(this.props.elapsed, this.props.skipped)
        for (const event of events) {
            let eventName = event.data.attributes.name

            if (eventName === 'phase.started') {
                let phase = this.config.getPhase(event.meta.set, event.meta.phase)
                this.props.phaseEndTime = this.props.elapsed + phase.duration
            }

            if (eventName === 'session.finished') setTimeout(() => this.stop(), 0)

            this.emit(eventName, event)
        }
    }
    tick () {
        this.props.elapsed++
        this.emit('ticked')
        this.emitEvents()
    }
    start () {
        if (this.is(Timer.states.READY) && !this.is(Timer.states.STOPPED)) {
            this.props.started = Date.now()
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

            // todo skip phase

            // todo build payload for skipped event

            this.emit('skipped') // fixme add event data
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
            this.props.started = null
            this.props.elapsed = 0
            this.state = Timer.states.READY
            this.emit('reset')
        }
    }
}