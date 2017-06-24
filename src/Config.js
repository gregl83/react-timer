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
        this.events = {}
        this.init(config)
    }
    static getMeta (set, phase) {
        if (typeof set === 'undefined') set = null
        if (typeof phase === 'undefined') phase = null

        return {set, phase}
    }
    init (config) {
        for (const [index, set] of config.sets.entries()) {
            let setStart = this.duration

            for (const phase of set.phases) {
                let phaseStart = this.duration

                let interval = new Interval(index, phase.name, phase.skip, phase.duration)

                this.addInterval(interval)

                let meta = Config.getMeta(index, phase.name)
                this.initEvents(phaseStart, this.duration, meta, phase.events, 'phase')
            }

            let meta = Config.getMeta(index)
            this.initEvents(setStart, this.duration, meta, set.events, 'set')
        }

        let meta = Config.getMeta()
        this.initEvents(0, this.duration, meta, config.events)
    }
    initEvents (start, end, meta, events, type) {
        if (Array.isArray(events)) {
            let allEvents = events

            if (typeof type !== 'undefined') {
                let typeEvents = [
                    {name: `${type}.started`, time: start},
                    {name: `${type}.finished`, time: end - start}
                ]
                allEvents = typeEvents.concat(events)
            }

            this.addEvents(start, end, meta, allEvents)
        }
    }
    addEvents (start, end, meta, events) {
        for (const event of events) {
            this.addEvent(start, end, meta, event)
        }
    }
    addEvent (start, end, meta, event) {
        if (!Number.isInteger(event.time)) throw new Error('event time must be an integer')
        if (Math.abs(event.time) > end - start) throw new Error('event time must within interval duration')

        let elapsed = event.time >= 0 ? start + event.time : end + event.time

        if (!Array.isArray(this.events[elapsed])) this.events[elapsed] = []

        this.events[elapsed].push({meta: meta, data: event})
    }
    addInterval (interval) {
        this.intervals.push(interval)
        this.duration += interval.duration
    }
}