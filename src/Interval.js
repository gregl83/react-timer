import { EventEmitter } from "fbemitter"

export default class Interval extends EventEmitter {
    constructor (duration) {
        super()
        this.duration = duration || 1000
        this.init()
    }
    init() {
        this.id = null
        this.started = null
        this.expectedElapsed = null
    }
    static getTimestamp () {
        return Date.now()
    }
    getNextTick () {
        let timestamp = Interval.getTimestamp()

        if (!this.expectedElapsed) this.expectedElapsed = timestamp
        else this.expectedElapsed += this.duration

        let nextTick = this.duration - (timestamp - this.expectedElapsed)
        return nextTick < 0 ? 0 : nextTick
    }
    run () {
        let nextTick = this.getNextTick()
        this.id = setTimeout(() => {
            this.emit('tick')
            this.run()
        }, nextTick)
    }
    start () {
        if (!this.id) {
            this.started = Interval.getTimestamp()
            this.run()
        }
    }
    stop () {
        if (this.id) {
            clearTimeout(this.id)
            this.init()
        }
    }
}