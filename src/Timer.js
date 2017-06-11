import { EventEmitter } from "fbemitter"
import Config from "./Config"
import Timeout from "./Timeout"

export default class Timer extends EventEmitter {
    constructor (config) {
        super()

        this.config = new Config(config)
        this.timeout = new Timeout()

        this.props = {
            tick: 200,
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
    start () {
        this.timeout.set(() => console.log("done"), this.props.tick)
    }
    pause () {

    }
    skip () {

    }
    stop () {

    }
    reset () {

    }
}