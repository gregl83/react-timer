class EventsIndex {
    constructor (duration, events) {
        this.duration = duration
        this.events = events
    }
    fetch (index) {
        let events = []

        let elapsed = index.elapsed + index.offset

        let fromStart = elapsed
        if (Array.isArray(this.events[fromStart])) events = events.concat(this.events[fromStart])

        let fromEnd = (this.duration - elapsed) * -1
        if (fromEnd && Array.isArray(this.events[fromEnd])) events = events.concat(this.events[fromEnd])

        return events
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

class Session extends EventsIndex {
    constructor (name, fixed, duration, events) {
        super(duration, events)
        this.name = name
        this.fixed = fixed
    }
}

class Set extends EventsIndex {
    constructor (duration, events) {
        super(duration, events)
    }
}

class Phase extends EventsIndex {
    constructor (set, name, duration, skip, events) {
        super(duration, events)
        this.set = set
        this.name = name
        this.skip = skip
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

        Config.addEventToIndex(null, {name: 'session.started', time: 0}, events)
        Config.addEventToIndex(null, {name: 'session.finished', time: sessionDuration}, events)

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

            Config.addEventToIndex(meta, {name: 'set.started', time: 0}, events)
            Config.addEventToIndex(meta, {name: 'set.finished', time: setDuration}, events)

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

                Config.addEventToIndex(meta, {name: 'phase.started', time: 0}, events)
                Config.addEventToIndex(meta, {name: 'phase.finished', time: phase.duration}, events)

                phases.push(new Phase(setIndex, phase.name, phase.duration, phase.skip, events))
            }
        }

        return phases
    }
    static createEventsIndex (duration, meta, events) {
        let index = {}

        if (!events) return index

        for (const event of events) {
            if (Math.abs(event.time) > duration) throw new Error('event time must be within interval duration')

            Config.addEventToIndex(meta, event, index)
        }

        return index
    }
    static addEventToIndex (meta, event, index) {
        let key = event.time

        if (!Array.isArray(index[key])) index[key] = []

        index[key].push(new Event(meta, event.name, event.time))
    }
    getEvents (session, set, phase) {
        let events = []

        events = events.concat(this.session.fetch(session))

        if (this.sets.length) events = events.concat(this.sets[set.index].fetch(set))

        if (this.phases.length) events = events.concat(this.phases[phase.index].fetch(phase))

        return events
    }
}