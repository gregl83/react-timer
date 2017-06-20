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
        this.name = config.name || null
        this.fixed = config.fixed || null
        this.duration = 0
        this.intervals = []
        this.events = []
        this.init(config)
    }
    init (config) {
        for (const [index, set] of config.sets.entries()) {
            for (const phase of set.phases) {
                let interval = new Interval(set.name, phase.name, phase.skip, phase.duration)

                this.addInterval(interval)

                this.addEvents({set: index, phase: phase.name}, phase.events)
            }

            this.addEvents({set: index}, set.events)
        }

        this.addEvents({}, config.events)
    }
    addEvents (meta, events) {
        for (const event of events) {
            this.addEvent(meta, event)
        }
    }
    addEvent (meta, event) {
        let elapsed = event.time > 0 ? event.time : this.duration + event.time

        if (typeof this.events[elapsed] === 'undefined') this.events[elapsed] = []

        this.events[elapsed].push({meta: meta, event: event})
    }
    addInterval (interval) {
        this.intervals.push(interval)
        this.duration += interval.duration
    }
}