class Interval {
    constructor (set, phase, skip, duration) {
        this.set = set
        this.phase = phase
        this.skip = skip
        this.duration = duration
    }
}

export default class Config {
    constructor (config) {
        this.name = config.name
        this.fixed = config.fixed
        this.duration = 0
        this.intervals = []
        this.events = []
        this.init(config)
    }
    init (config) {
        for (const [index, set] of config.sets.entries()) {
            let setStart = this.duration

            for (const phase of set.phases) {
                let phaseStart = this.duration

                let interval = new Interval(index, phase.name, phase.skip, phase.duration)

                this.addInterval(interval)

                this.addEvents(phaseStart, this.duration, {set: index, phase: phase.name}, phase.events)
            }

            this.addEvents(setStart, this.duration, {set: index}, set.events)
        }

        this.addEvents(0, this.duration, {}, config.events)
    }
    addEvents (start, end, meta, events) {
        for (const event of events) {
            this.addEvent(start, end, meta, event)
        }
    }
    addEvent (start, end, meta, event) {
        if (!event.time) throw new Error('event time must be non-zero value')
        if (Math.abs(event.time) >= end - start) throw new Error('event time must within interval duration')

        let elapsed = event.time > 0 ? start + event.time : end + event.time

        if (typeof this.events[elapsed] === 'undefined') this.events[elapsed] = []

        this.events[elapsed].push({meta: meta, event: event})
    }
    addInterval (interval) {
        this.intervals.push(interval)
        this.duration += interval.duration
    }
}