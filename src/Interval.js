import { EventEmitter } from "fbemitter"

export default class Interval extends EventEmitter {
    constructor () {
        super()
        this.id = null
    }
    timeout () {
        let date = new Date()
        let timeToSecond = 1000 - date.getTime() % 1000
        let timeIncomplete = (timeToSecond < 10)

        if (!timeIncomplete) this.emit('tick', date)

        this.id = setTimeout(() => this.timeout, timeToSecond)
    }
    start () {
        if (!this.id) this.timeout()
    }
    stop () {
        if (this.id) clearTimeout(this.id)
    }
}