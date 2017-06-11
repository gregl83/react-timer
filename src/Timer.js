import { EventEmitter } from "fbemitter"
import Config from "./Config"
import Interval from "./Interval"

export default class Timer extends EventEmitter {
    constructor (config) {
        super()

        this.config = new Config(config)
        this.interval = new Interval

        this.props = {
            time: null, // todo consider config
            elapsed: 0,
            startDate: null,
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
    tick () {
        // todo tick
        this.emit('ticked')
    }
    start () {
        if (this.is(Timer.states.READY) && !this.is(Timer.states.STARTED)) {
            //this.timeout.set(() => console.log("done"), this.props.tick)
            // fixme start timer
            this.state = Timer.states.STARTED
            this.emit('started')
        }
    }
    pause () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.PAUSED)) {
            // fixme pause timer
            this.state = Timer.states.PAUSED
            this.emit('paused')
        }
    }
    skip () {

    }
    stop () {
        if (this.is(Timer.states.STARTED) && !this.is(Timer.states.STOPPED)) {
            // fixme stop timer
            this.state = Timer.states.STOPPED
            this.emit('stopped')
        }
    }
    reset () {
        if (this.is(Timer.states.STARTED)) {
            this.stop()
            // fixme reset timer
            this.state = Timer.states.READY
            this.emit('reset')
        }
    }
}