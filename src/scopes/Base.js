export default class Base {
    constructor (duration, events) {
        this.duration = duration
        this.events = events
    }
    getEvents (index) {
        let events = []

        let fromStart = index.elapsed
        events = events.concat(this.events.get(fromStart))

        let fromEnd = (this.duration - index.elapsed) * -1
        if (fromEnd && Array.isArray(this.events[fromEnd])) events = events.concat(this.events[fromEnd])

        return events
    }
}