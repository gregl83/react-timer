import { EventEmitter } from "fbemitter"

export default class Interval extends EventEmitter {
    constructor () {
        super()
        this.id = null
    }
    timeout (offset) {
        let date = new Date()

        // todo allow timeouts to run on an offset

        if (!offset) offset = date.getTime() % 1000

        let timeToSecond = offset - date.getTime() % 1000
        let timeIncomplete = (timeToSecond < 10)

        if (!timeIncomplete) this.emit('tick', date)

        this.id = setTimeout(() => this.timeout(offset), timeToSecond)
    }
    start () {
        if (!this.id) this.timeout()
    }
    stop () {
        if (this.id) clearTimeout(this.id)
    }
}