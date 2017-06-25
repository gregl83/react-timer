class EventMeta {
    constructor (set, phase) {
        this.set = set
        if (Number.isInteger(phase)) this.phase = phase
    }
}

class Event {
    constructor (meta, name, time) {
        if (meta) this.meta = meta
        this.data = {
            attributes: {
                name,
                time
            }
        }
    }
}

export default class Config {
    constructor (config) {
        this.name = config.name
        this.fixed = config.fixed
        this.duration = 0
        this.phases = Config.createPhaseIndex(config)
        this.events = Config.createEventIndex(config)
    }
    static createPhaseIndex (config) {
        let index = {}

        for (const [setIndex, set] of config.sets.entries()) {
            for (const [phaseIndex, phase] of set.phases.entries()) {
                Config.addPhaseToIndex(setIndex, phaseIndex, phase, index)
            }
        }

        return index
    }
    static addPhaseToIndex (setIndex, phaseIndex, phase, index) {
        let key = `${setIndex}.${phaseIndex}`
        index[key] = phase
    }
    static createEventIndex (config) {
        let index = {}

        let elapsed = 0
        for (const [setIndex, set] of config.sets.entries()) {
            let setElapsed = elapsed
            let setDuration = 0

            for (const [phaseIndex, phase] of set.phases.entries()) {
                let eventsMeta = new EventMeta(setIndex, phaseIndex)
                let eventsGroup = Config.createEventsGroup('phase', phase.duration, phase.events)
                Config.addEventsToIndex(elapsed, phase.duration, eventsGroup, eventsMeta, index)

                elapsed += phase.duration
                setDuration += phase.duration
            }

            let eventsMeta = new EventMeta(setIndex)
            let eventsGroup = Config.createEventsGroup('set', setDuration, set.events)
            Config.addEventsToIndex(setElapsed, setDuration, eventsGroup, eventsMeta, index)
        }

        let eventsGroup = Config.createEventsGroup('session', elapsed, config.events)
        Config.addEventsToIndex(0, elapsed, eventsGroup, null, index)

        return index
    }
    static createEventsGroup (name, duration, events) {
        if (!Array.isArray(events)) return []

        let eventsGroup = events.slice()
        eventsGroup.push({name: `${name}.started`, time: 0})
        eventsGroup.push({name: `${name}.finished`, time: duration})

        return eventsGroup
    }
    static addEventsToIndex (start, duration, events, meta, index) {
        for (const event of events) {
            if (Math.abs(event.time) > duration) throw new Error('event time must be within interval duration')

            let absoluteTime = event.time >= 0 ? event.time : duration + event.time
            let key = absoluteTime + start

            if (!Array.isArray(index[key])) index[key] = []

            index[key].push(new Event(meta, event.name, event.time))
        }
    }
    getEvents (elapsed, skipped) {
        let key = elapsed + skipped
        return Array.isArray(this.events[key]) ? this.events[key] : []
    }
    getPhase (setIndex, phaseIndex) {
        let key = `${setIndex}.${phaseIndex}`
        return this.phases[key]
    }
}