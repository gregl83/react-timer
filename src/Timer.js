import Config from "./Config"
import Timeout from "./Timeout"

export default class Timer {
    constructor (config) {
        this.config = new Config(config)
        this.timeout = new Timeout()

        this.tick = 200
        this.time = null // todo consider config
        this.elapsed = 0
        this.startDate = null
        this.started = false
        this.paused = false
        this.stopped = false

    }
    start () {
        this.timeout.set(() => console.log("done"), this.tick)
    }
    pause () {

    }
    stop () {

    }
}