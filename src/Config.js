import Event from './event/Event'
import EventMeta from './event/Meta'
import EventIndex from './event/Index'
import Session from './scopes/Session'
import Set from './scopes/Set'
import Phase from './scopes/Phase'

export default class Config {
    constructor (config) {
        this.unparsed = config
    }
    init () {
        this.session = Config.createSession(this.unparsed)
        this.sets = Config.createSets(this.unparsed)
        this.phases = Config.createPhases(this.unparsed)
    }
    static createSession (config) {
        let sessionDuration = 0

        for (const set of config.sets) {
            for (const phase of set.phases) {
                sessionDuration += phase.duration
            }
        }

        let events = Config.createEventsIndex('session', sessionDuration, null, config.events)

        return new Session(config.name, config.type, sessionDuration, events)
    }
    static createSets (config) {
        let sets = []

        for (const [setIndex, set] of config.sets.entries()) {
            let setDuration = 0

            for (const phase of set.phases) {
                setDuration += phase.duration
            }

            let meta = new EventMeta(setIndex)
            let events = Config.createEventsIndex('set', setDuration, meta, set.events)

            sets.push(new Set(setDuration, events))
        }

        return sets
    }
    static createPhases (config) {
        let phases = []

        for (const [setIndex, set] of config.sets.entries()) {
            phases[setIndex] = []

            for (const [phaseIndex, phase] of set.phases.entries()) {
                let meta = new EventMeta(setIndex, phaseIndex)
                let events = Config.createEventsIndex('phase', phase.duration, meta, phase.events)

                phases[setIndex].push(new Phase(setIndex, phase.name, phase.duration, phase.skip, events))
            }
        }

        return phases
    }
    static createEventsIndex (scope, duration, meta, events) {
        let index = new EventIndex

        index.add(new Event(meta, `${scope}.started`, 0))
        if (events) {
            for (const event of events) {
                let eventTime = event.time < 0 ? duration + event.time : event.time

                if (eventTime > duration) throw new Error(`event time must be within ${scope} duration`)

                index.add(new Event(meta, event.name, eventTime))
            }
        }
        index.add(new Event(meta, `${scope}.finished`, duration))

        return index
    }
    getPhase (set, phase) {
        return this.phases[set.index][phase.index]
    }
    adjustPhase (set, phase, adjustment) {
        this.phases[set.index][phase.index].duration += adjustment
        this.phases[set.index][phase.index].events = Config.createEventsIndex(
            'phase',
            this.phases[set.index][phase.index].duration,
            new EventMeta(set.index, phase.index),
            this.unparsed.sets[set.index].phases[phase.index].events
        )

        this.sets[set.index].duration += adjustment
        this.sets[set.index].events = Config.createEventsIndex(
            'set',
            this.sets[set.index].duration,
            new EventMeta(set.index),
            this.unparsed.sets[set.index].events
        )

        this.session.duration += adjustment
        this.session.events = Config.createEventsIndex(
            'session',
            this.session.duration,
            null,
            this.unparsed.events
        )
    }
    getEvents (session, set, phase) {
        let events = []

        if (session) events = events.concat(this.session.getEvents(session))

        if (set && this.sets.length) {
            events = events.concat(this.sets[set.index].getEvents(set))

            if (phase && this.phases[set.index][phase.index]) {
                events = events.concat(this.phases[set.index][phase.index].getEvents(phase))
            }
        }

        return events
    }
}