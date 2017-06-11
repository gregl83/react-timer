import Config from "./Config"
import Timeout from "./Timeout"

export default class Timer {
    constructor (config) {
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
        switch (state) {
            case Timer.states.STARTED:
                this.props.state = Timer.states.READY | Timer.states.STARTED
                break
            case Timer.states.PAUSED:
                this.props.state = Timer.states.READY | Timer.states.STARTED | Timer.states.PAUSED
                break
            case Timer.states.STOPPED:
                this.props.state = Timer.states.READY | Timer.states.STARTED | Timer.states.PAUSED | Timer.states.STOPPED
                break
            case Timer.states.READY:
            default:
                this.props.state = Timer.states.READY
                break
        }
    }
    is (state) {
        return (this.props.state & state) === state
    }
    start () {
        this.timeout.set(() => console.log("done"), this.props.tick)
    }
    pause () {

    }
    stop () {

    }
    reset () {

    }
}