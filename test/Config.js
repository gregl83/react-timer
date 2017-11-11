import should from "should"
import Config from "../src/Config"
import EventIndex from "../src/event/Index"
import Session from "../src/scopes/Session"
import Set from "../src/scopes/Set"
import Phase from "../src/scopes/Phase"

function assertScopes(config) {
    should(config.session).be.instanceOf(Session)
    should(config.session.events).be.instanceOf(EventIndex)

    should(config.sets).be.instanceOf(Array)
    should(config.sets).be.length(0)

    should(config.phases).be.instanceOf(Array)
    should(config.phases).be.length(0)
}

function assertStartEndEvents(scope, duration, index) {
    should(index[0]).be.instanceOf(Array)
    should(index[0]).be.length(1)
    should(index[0][0].data.attributes.name).be.equal(`${scope}.started`)

    should(index[duration]).be.instanceOf(Array)
    should(index[duration]).be.length(1)
    should(index[duration][0].data.attributes.name).be.equal(`${scope}.finished`)
}

describe('Config', () => {
    describe('init', () => {
        let raw = {
            name: 'test',
            type: 'constant',
            sets: [],
            events: []
        }

        let config = new Config(raw)

        config.init()

        it('builds scopes', done => {
            assertScopes(config)
            done()
        })

        it('rebuilds scopes', done => {
            config.session = null
            config.sets = null
            config.phases = null

            config.init()

            assertScopes(config)

            done()
        })
    })

    describe('scopes', () => {
        describe('session', () => {
            let raw = {
                name: 'session',
                type: 'dynamic',
                sets: [
                    {phases: [{name: 'one', duration: 60, skip: false}]}
                ],
                events: [
                    {name: 'alpha', time: -10},
                    {name: 'bravo', time: 10}
                ]
            };

            let config = new Config(raw)
            config.init()

            it('sets properties', done => {
                let session = config.session

                should(session.name).be.equal(raw.name)
                should(session.type).be.equal(raw.type)
                should(session.duration).be.equal(60)
                should(session.events).be.instanceOf(EventIndex)

                done()
            })

            it('indexes events', done => {
                let index = config.session.events.index

                assertStartEndEvents('session', 60, index)

                should(index[10]).be.instanceOf(Array)
                should(index[10]).be.length(1)
                should(index[10][0].meta).be.undefined()
                should(index[10][0].data.attributes.name).be.deepEqual(raw.events[1].name)

                should(index[50]).be.instanceOf(Array)
                should(index[50]).be.length(1)
                should(index[50][0].meta).be.undefined()
                should(index[50][0].data.attributes.name).be.deepEqual(raw.events[0].name)

                done()
            })
        })

        describe('sets', () => {
            let raw = {
                name: 'sets',
                type: 'dynamic',
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
            config.init()

            it('sets properties', done => {
                let sets = config.sets

                should(sets[0]).be.instanceOf(Set)
                should(sets[0].duration).be.equal(20)
                should(sets[0].events).be.instanceOf(EventIndex)

                should(sets[1]).be.instanceOf(Set)
                should(sets[1].duration).be.equal(40)
                should(sets[1].events).be.instanceOf(EventIndex)

                done()
            })

            it('indexes events', done => {
                let indexOne = config.sets[0].events.index

                assertStartEndEvents('set', 20, indexOne)

                should(indexOne[10]).be.instanceOf(Array)
                should(indexOne[10]).be.length(1)
                should(indexOne[10][0].meta.set).be.equal(0)
                should(indexOne[10][0].meta.phase).be.undefined()
                should(indexOne[10][0].data.attributes.name).be.deepEqual(raw.sets[0].events[0].name)

                let indexTwo = config.sets[1].events.index

                assertStartEndEvents('set', 40, indexTwo)

                should(indexTwo[30]).be.instanceOf(Array)
                should(indexTwo[30]).be.length(1)
                should(indexTwo[30][0].meta.set).be.equal(1)
                should(indexTwo[30][0].meta.phase).be.undefined()
                should(indexTwo[30][0].data.attributes.name).be.deepEqual(raw.sets[1].events[0].name)

                done()
            })
        })

        describe('phases', () => {
            let raw = {
                name: 'phases',
                type: 'dynamic',
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
            config.init()

            it('sets properties', done => {
                let phases = config.phases[0]

                should(phases[0]).be.instanceOf(Phase)
                should(phases[0].duration).be.equal(20)
                should(phases[0].events).be.instanceOf(EventIndex)

                should(phases[1]).be.instanceOf(Phase)
                should(phases[1].duration).be.equal(40)
                should(phases[1].events).be.instanceOf(EventIndex)

                done()
            })

            it('indexes events', done => {
                let indexOne = config.phases[0][0].events.index

                should(indexOne[10]).be.instanceOf(Array)
                should(indexOne[10]).be.length(1)
                should(indexOne[10][0].meta.set).be.equal(0)
                should(indexOne[10][0].meta.phase).be.equal(0)
                should(indexOne[10][0].data.attributes.name).be.deepEqual(raw.sets[0].phases[0].events[0].name)

                let indexTwo = config.phases[0][1].events.index

                should(indexTwo[30]).be.instanceOf(Array)
                should(indexTwo[30]).be.length(1)
                should(indexTwo[30][0].meta.set).be.equal(0)
                should(indexTwo[30][0].meta.phase).be.equal(1)
                should(indexTwo[30][0].data.attributes.name).be.deepEqual(raw.sets[0].phases[1].events[0].name)

                done()
            })
        })
    })

    describe('getPhase', () => {
        let raw = {
            name: 'phases',
            type: 'dynamic',
            sets: [
                {
                    phases: [{name: 'one', duration: 20}]
                }
            ]
        }

        let config = new Config(raw)
        config.init()

        it('gets a phase', done => {
            should(config.phases[0][0]).be.deepEqual(
                config.getPhase({index: 0}, {index: 0})
            )

            done()
        })
    })

    describe('adjustPhase', () => {
        let raw = {
            name: 'phases',
            type: 'dynamic',
            sets: [
                {
                    phases: [
                        {name: 'one', duration: 20},
                        {name: 'two', duration: 20},
                    ]
                },
                {
                    phases: [
                        {name: 'three', duration: 20}
                    ]
                }
            ]
        }

        let config = new Config(raw)
        config.init()

        config.adjustPhase({index: 0}, {index: 0}, 10)

        describe('session', () => {
            it('adjusts duration', done => {
                should(config.session.duration).be.equal(70)
                done()
            })

            it('re-indexes events', done => {
                let index = config.session.events.index

                assertStartEndEvents('session', 70, index)

                done()
            })
        })

        describe('set', () => {
            it('adjusts duration', done => {
                should(config.sets[0].duration).be.equal(50)
                done()
            })

            it('re-indexes events', done => {
                let indexOne = config.sets[0].events.index

                assertStartEndEvents('set', 50, indexOne)

                let indexTwo = config.sets[1].events.index

                assertStartEndEvents('set', 20, indexTwo)

                done()
            })
        })

        describe('phase', () => {
            it('adjusts duration', done => {
                should(config.phases[0][0].duration).be.equal(30)
                done()
            })

            it('re-indexes events', done => {
                let indexOne = config.phases[0][0].events.index

                assertStartEndEvents('phase', 30, indexOne)

                let indexTwo = config.phases[0][1].events.index

                assertStartEndEvents('phase', 20, indexTwo)

                let indexThree = config.phases[1][0].events.index

                assertStartEndEvents('phase', 20, indexThree)

                done()
            })
        })
    })

    describe('getEvents', () => {
        let raw = {
            name: 'events',
            type: 'dynamic',
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
                            duration: 20,
                            skip: false,
                            events: [
                                {name: 'bravo', time: -10}
                            ]
                        }
                    ],
                    events: [
                        {name: 'charlie', time: -10}
                    ]
                },
                {
                    phases: [
                        {
                            name: "three",
                            duration: 20,
                            skip: false,
                            events: [
                                {name: 'delta', time: 20}
                            ]
                        }
                    ],
                    events: [
                        {name: 'echo', time: 20}
                    ]
                }
            ],
            events: [
                {name: 'foxtrot', time: 10}
            ]
        }

        let config = new Config(raw)
        config.init()

        it('gets all events for 0 seconds elapsed', done => {
            let events = config.getEvents(
                {elapsed: 0},
                {index: 0, elapsed: 0},
                {index: 0, elapsed: 0},
            )

            should(events).be.instanceOf(Array)
            should(events).be.length(3)

            done()
        })

        it('gets all events for 10 seconds elapsed', done => {
            let events = config.getEvents(
                {elapsed: 10},
                {index: 0, elapsed: 10},
                {index: 0, elapsed: 10},
            )

            should(events).be.instanceOf(Array)
            should(events).be.length(2)

            done()
        })

        it('gets all events for 30 seconds elapsed', done => {
            let events = config.getEvents(
                {elapsed: 30},
                {index: 0, elapsed: 30},
                {index: 1, elapsed: 10},
            )

            should(events).be.instanceOf(Array)
            should(events).be.length(2)

            done()
        })

        it('gets all events for 40 seconds elapsed', done => {
            let events = config.getEvents(
                {elapsed: 40},
                {index: 0, elapsed: 40},
                {index: 1, elapsed: 20},
            )

            should(events).be.instanceOf(Array)
            should(events).be.length(2)

            done()
        })

        it('gets all events for 60 seconds elapsed', done => {
            let events = config.getEvents(
                {elapsed: 60},
                {index: 1, elapsed: 20},
                {index: 0, elapsed: 20},
            )

            should(events).be.instanceOf(Array)
            should(events).be.length(5)

            done()
        })
    })
})