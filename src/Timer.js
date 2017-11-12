import { EventEmitter } from "fbemitter"
import Config from "./Config"
import Interval from "./Interval"
import Event from './event/Event'
import EventMeta from './event/Meta'

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
    emitEvent (name) {
        let eventMeta = new EventMeta(this.props.set.index, this.props.phase.index)
        let event = new Event(eventMeta, name, this.props.session.elapsed)
        this.emit(name, event)
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

        let excludeEvents = ['session', 'set', 'phase']

        if (sessionFinished) return setTimeout(() => this.stop(), 0)

        if (setFinished) {
            excludeEvents.splice(1, 2)

            this.props.set.index++
            this.props.set.elapsed = 0

            this.props.phase.index = 0
            this.props.phase.elapsed = 0
        } else if (phaseFinished) {
            excludeEvents.splice(2, 1)

            this.props.phase.index++
            this.props.phase.elapsed = 0
        }

        events = this.config.getEvents(this.props.session, this.props.set, this.props.phase, excludeEvents)

        for (const event of events) {
            let eventName = event.data.attributes.name
            this.emit(eventName, event)
        }
    }
    tick () {
        this.props.session.elapsed++
        this.props.set.elapsed++
        this.props.phase.elapsed++
        this.emitEvent('ticked')
        this.emitEvents()
    }
    start () {
        if (this.is(Timer.states.READY) && !this.is(Timer.states.STOPPED)) {
            this.props.session.started = Date.now()
            this.interval.start()
            this.state = Timer.states.STARTED
            this.emitEvent('started')
            this.emitEvents()
        }
    }
    pause () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.PAUSED)) {
            this.interval.pause()
            this.state = Timer.states.PAUSED
            this.emitEvent('paused')
        }
    }
    skip () {
        let phase = this.config.getPhase(this.props.set, this.props.phase)

        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.STOPPED) && phase.skip) {
            this.emitEvent('skipped')

            let remainder = phase.duration - this.props.phase.elapsed
            let adjustment = remainder * -1
            this.config.adjustPhase(this.props.set, this.props.phase, adjustment)

            if (this.config.session.type === 'constant') {
                let setIndex = this.props.set.index
                let phaseIndex = this.props.phase.index + 1

                if (!this.config.phases[setIndex][phaseIndex]) {
                    setIndex++
                    phaseIndex = 0
                }

                if (this.config.phases[setIndex] && this.config.phases[setIndex][phaseIndex]) {
                    this.config.adjustPhase({index: setIndex}, {index: phaseIndex}, remainder)
                }
            }

            this.emitEvents()
        }
    }
    stop () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.STOPPED)) {
            this.interval.stop()
            this.state = Timer.states.STOPPED
            this.emitEvent('stopped')
        }
    }
    reset () {
        if (this.is(Timer.states.STARTED)) {
            this.stop()
            this.init()
            this.emitEvent('reset')
        }
    }
}