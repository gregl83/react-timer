import Config from "../src/Config"
import sinon from "sinon"
import should from "should"

describe('Config', () => {
    describe('session', () => {
        it('base properties', done => {
            let raw = {
                name: 'test',
                fixed: true,
                sets: [],
                events: []
            }

            let config = new Config(raw)

            let session = config.session

            should(session.name).be.equal(raw.name)
            should(session.fixed).be.true()
            should(session.duration).be.equal(0)
            should(session.events[0].constructor.name).be.equal('Array')
            should(session.events[0]).be.length(2)

            // todo - more robust standard event tests

            done()
        })

        it('events from start and end', done => {
            let raw = {
                name: 'start-end-session',
                fixed: false,
                sets: [
                    {phases: [{name: 'one', duration: 60, skip: false}]}
                ],
                events: [
                    {name: 'alpha', time: -10},
                    {name: 'bravo', time: 10}
                ]
            };

            let config = new Config(raw)

            let events = config.session.events

            should(events[-10]).not.be.undefined()
            should(events[-10].constructor.name).be.equal('Array')
            should(events[-10]).be.length(1)

            should(events[-10][0].meta).be.undefined()
            should(events[-10][0].data.attributes).be.deepEqual(raw.events[0])

            should(events[10]).not.be.undefined()
            should(events[10].constructor.name).be.equal('Array')
            should(events[10]).be.length(1)

            should(events[10][0].meta).be.undefined()
            should(events[10][0].data.attributes).be.deepEqual(raw.events[1])

            done()
        })
    })

    describe('sets', () => {
        it('base properties', done => {
            let raw = {
                name: 'test',
                fixed: false,
                sets: [
                    {
                        phases: [{name: 'one', duration: 60, skip: false}],
                        events: []
                    }
                ]
            }

            let config = new Config(raw)

            let set = config.sets[0]

            should(set.duration).be.equal(raw.sets[0].phases[0].duration)
            should(set.events[0].constructor.name).be.equal('Array')
            should(set.events[0]).be.length(1)
            should(set.events[60].constructor.name).be.equal('Array')
            should(set.events[60]).be.length(1)

            // todo - more robust standard event tests

            done()
        })

        it('events from start and end', done => {
            let raw = {
                name: 'start-end-set',
                fixed: false,
                sets: [
                    {
                        phases: [{name: 'one', duration: 60, skip: false}],
                        events: [
                            {name: 'alpha', time: -10},
                            {name: 'bravo', time: 10}
                        ]
                    }
                ]
            }

            let config = new Config(raw)

            let events = config.sets[0].events

            should(events[-10]).not.be.undefined()
            should(events[-10].constructor.name).be.equal('Array')
            should(events[-10]).be.length(1)

            should(events[-10][0].meta.set).be.equal(0)
            should(events[-10][0].meta.phase).be.undefined()
            should(events[-10][0].data.attributes).be.deepEqual(raw.sets[0].events[0])

            should(events[10]).not.be.undefined()
            should(events[10].constructor.name).be.equal('Array')
            should(events[10]).be.length(1)

            should(events[10][0].meta.set).be.equal(0)
            should(events[10][0].meta.phase).be.undefined()
            should(events[10][0].data.attributes).be.deepEqual(raw.sets[0].events[1])

            done()
        })

        it('events in multiple sets', done => {
            let raw = {
                name: 'multi-set',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {
                                name: 'one',
                                duration: 20,
                                skip: false,
                            }
                        ],
                        events: [
                            {name: 'alpha', time: 10}
                        ]
                    },
                    {
                        phases: [
                            {
                                name: 'two',
                                duration: 40,
                                skip: false,
                            }
                        ],
                        events: [
                            {name: 'bravo', time: -10}
                        ]
                    }
                ]
            }

            let config = new Config(raw)

            let eventsOne = config.sets[0].events

            should(eventsOne[10]).not.be.undefined()
            should(eventsOne[10].constructor.name).be.equal('Array')
            should(eventsOne[10]).be.length(1)

            should(eventsOne[10][0].meta.set).be.equal(0)
            should(eventsOne[10][0].meta.phase).be.undefined()
            should(eventsOne[10][0].data.attributes).be.deepEqual(raw.sets[0].events[0])

            let eventsTwo = config.sets[1].events

            should(eventsTwo[-10]).not.be.undefined()
            should(eventsTwo[-10].constructor.name).be.equal('Array')
            should(eventsTwo[-10]).be.length(1)

            should(eventsTwo[-10][0].meta.set).be.equal(1)
            should(eventsTwo[-10][0].meta.phase).be.undefined()
            should(eventsTwo[-10][0].data.attributes).be.deepEqual(raw.sets[1].events[0])

            done()
        })
    })

    describe('phases', () => {
        it('base properties', done => {
            let raw = {
                name: 'test',
                fixed: false,
                sets: [
                    {
                        phases: [{name: 'one', duration: 60, skip: false}],
                        events: []
                    }
                ]
            }

            let config = new Config(raw)

            let phase = config.phases[0][0]

            should(phase.set).be.equal(0)
            should(phase.name).be.equal(raw.sets[0].phases[0].name)
            should(phase.duration).be.equal(raw.sets[0].phases[0].duration)
            should(phase.skip).be.equal(raw.sets[0].phases[0].skip)
            should(phase.events[0].constructor.name).be.equal('Array')
            should(phase.events[0]).be.length(1)
            should(phase.events[60].constructor.name).be.equal('Array')
            should(phase.events[60]).be.length(1)

            // todo - more robust standard event tests

            done()
        })

        it('events from start and end', done => {
            let raw = {
                name: 'start-end-phase',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {
                                name: 'one',
                                duration: 60,
                                skip: false,
                                events: [
                                    {name: 'alpha', time: -10},
                                    {name: 'bravo', time: 10}
                                ]
                            }
                        ]
                    }
                ]
            }

            let config = new Config(raw)

            let events = config.phases[0][0].events

            should(events[-10]).not.be.undefined()
            should(events[-10].constructor.name).be.equal('Array')
            should(events[-10]).be.length(1)

            should(events[-10][0].meta.set).be.equal(0)
            should(events[-10][0].meta.phase).be.equal(0)
            should(events[-10][0].data.attributes).be.deepEqual(raw.sets[0].phases[0].events[0])

            should(events[10]).not.be.undefined()
            should(events[10].constructor.name).be.equal('Array')
            should(events[10]).be.length(1)

            should(events[10][0].meta.set).be.equal(0)
            should(events[10][0].meta.phase).be.equal(0)
            should(events[10][0].data.attributes).be.deepEqual(raw.sets[0].phases[0].events[1])

            done()
        })

        it('events in multiple phases', done => {
            let raw = {
                name: 'multi-phase',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {
                                name: 'one',
                                duration: 20,
                                skip: false,
                                events: [
                                    {name: 'alpha', time: 10}
                                ]
                            },
                            {
                                name: 'two',
                                duration: 40,
                                skip: false,
                                events: [
                                    {name: 'bravo', time: -10}
                                ]
                            }
                        ]
                    }
                ]
            }

            let config = new Config(raw)

            let eventsOne = config.phases[0][0].events

            should(eventsOne[10]).not.be.undefined()
            should(eventsOne[10].constructor.name).be.equal('Array')
            should(eventsOne[10]).be.length(1)

            should(eventsOne[10][0].meta.set).be.equal(0)
            should(eventsOne[10][0].meta.phase).be.equal(0)
            should(eventsOne[10][0].data.attributes).be.deepEqual(raw.sets[0].phases[0].events[0])

            let eventsTwo = config.phases[0][1].events

            should(eventsTwo[-10]).not.be.undefined()
            should(eventsTwo[-10].constructor.name).be.equal('Array')
            should(eventsTwo[-10]).be.length(1)

            should(eventsTwo[-10][0].meta.set).be.equal(0)
            should(eventsTwo[-10][0].meta.phase).be.equal(1)
            should(eventsTwo[-10][0].data.attributes).be.deepEqual(raw.sets[0].phases[1].events[0])

            done()
        })
    })

    it('events in every scope', done => {
        let raw = {
            name: 'every-scope',
            fixed: false,
            sets: [
                {
                    phases: [
                        {
                            name: 'one',
                            duration: 60,
                            skip: false,
                            events: [
                                {name: 'alpha', time: 10}
                            ]
                        }
                    ],
                    events: [
                        {name: 'bravo', time: 30}
                    ]
                }
            ],
            events: [
                {name: 'charlie', time: -10}
            ]
        }

        let config = new Config(raw)

        let sessionEvents = config.session.events

        should(sessionEvents[-10]).not.be.undefined()
        should(sessionEvents[-10].constructor.name).be.equal('Array')
        should(sessionEvents[-10]).be.length(1)

        should(sessionEvents[-10][0].meta).be.undefined()
        should(sessionEvents[-10][0].data.attributes).be.deepEqual(raw.events[0])

        let setEvents = config.sets[0].events

        should(setEvents[30]).not.be.undefined()
        should(setEvents[30].constructor.name).be.equal('Array')
        should(setEvents[30]).be.length(1)

        should(setEvents[30][0].meta.set).be.equal(0)
        should(setEvents[30][0].meta.phase).be.undefined()
        should(setEvents[30][0].data.attributes).be.deepEqual(raw.sets[0].events[0])

        let phaseEvents = config.phases[0][0].events

        should(phaseEvents[10]).not.be.undefined()
        should(phaseEvents[10].constructor.name).be.equal('Array')
        should(phaseEvents[10]).be.length(1)

        should(phaseEvents[10][0].meta.set).be.equal(0)
        should(phaseEvents[10][0].meta.phase).be.equal(0)
        should(phaseEvents[10][0].data.attributes).be.deepEqual(raw.sets[0].phases[0].events[0])

        done()
    })
})