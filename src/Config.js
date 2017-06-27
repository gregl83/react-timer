class Session {
    constructor (name, fixed, duration, events) {
        this.name = name
        this.fixed = fixed
        this.duration = duration
        this.events = events
    }
}

class Set {
    constructor (duration, events) {
        this.duration = duration
        this.events = events
    }
}

class Phase {
    constructor (set, name, duration, skip, events) {
        this.set = set
        this.name = name
        this.duration = duration
        this.skip = skip
        this.events = events
    }
}

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
        this.session = Config.createSession(config)
        this.sets = Config.createSets(config)
        this.phases = Config.createPhases(config)
    }
    static createSession (config) {
        let sessionDuration = 0

        for (const set of config.sets) {
            for (const phase of set.phases) {
                sessionDuration += phase.duration
            }
        }

        let events = Config.createEventsIndex(sessionDuration, null, config.events)

        return new Session(config.name, config.fixed, sessionDuration, events)
    }
    static createSets (config) {
        let sets = []

        for (const [setIndex, set] of config.sets.entries()) {
            let setDuration = 0

            for (const phase of set.phases) {
                setDuration += phase.duration
            }

            let meta = new EventMeta(setIndex)
            let events = Config.createEventsIndex(setDuration, meta, set.events)

            sets.push(new Set(setDuration, events))
        }

        return sets
    }
    static createPhases (config) {
        let phases = []

        for (const [setIndex, set] of config.sets.entries()) {
            for (const [phaseIndex, phase] of set.phases.entries()) {
                let meta = new EventMeta(setIndex, phaseIndex)
                let events = Config.createEventsIndex(phase.duration, meta, phase.events)

                phases.push(new Phase(setIndex, phase.name, phase.duration, phase.skip, events))
            }
        }

        return phases
    }
    static createEventsIndex (duration, meta, events) {
        let index = {}

        for (const event of events) {
            if (Math.abs(event.time) > duration) throw new Error('event time must be within interval duration')

            Config.addEventToIndex(meta, event, index)
        }

        return index
    }
    static addEventToIndex (meta, event, index) {
        let key = event.time

        if (Array.isArray(index[key])) index[key] = []

        index.push(new Event(meta, event.name, event.time))
    }
}