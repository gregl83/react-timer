import { EventEmitter } from "fbemitter"

export default class Interval extends EventEmitter {
    constructor (duration) {
        super()
        this.duration = duration || 1000
        this.init()
    }
    init() {
        this.id = null
        this.expectedElapsed = null
        this.remainder = null
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
    run (nextTick) {
        this.id = setTimeout(() => {
            this.emit('tick')
            this.run()
        }, nextTick || this.getNextTick())
    }
    start () {
        if (!this.id) {
            this.run(this.remainder)
        }
    }
    pause () {
        if (this.id) {
            clearTimeout(this.id)
            let remainder = this.duration - this.getNextTick()
            this.init()
            this.remainder = remainder
        }
    }
    stop () {
        if (this.id) {
            clearTimeout(this.id)
            this.init()
        }
    }
}