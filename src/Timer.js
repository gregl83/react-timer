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
            running: false,
        }
    }
    start () {
        this.timeout.set(() => console.log("done"), this.props.tick)
    }
    pause () {

    }
    stop () {

    }
}