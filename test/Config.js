import Config from "../src/Config"
import sinon from "sinon"
import should from "should"

describe('Config', () => {
    describe('initializes', () => {
        it('base properties', done => {
            let config = new Config({
                name: 'test',
                fixed: true,
                sets: [],
                events: []
            })

            should(config.name).be.equal('test')
            should(config.fixed).be.true()

            done()
        })

        it('intervals', done => {
            let config = new Config({
                name: 'test',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {
                                name: 'one',
                                duration: 60,
                                skip: false,
                                events: []
                            }
                        ],
                        events: []
                    },
                    {
                        phases: [
                            {
                                name: 'two',
                                duration: 120,
                                skip: true,
                                events: []
                            }
                        ],
                        events: []
                    }
                ],
                events: []
            })

            should(config.intervals).be.length(2)
            should(config.duration).be.equal(180)

            should(config.intervals[0].constructor.name).be.equal('Interval')
            should(config.intervals[0].set).be.equal(0)
            should(config.intervals[0].phase).be.equal('one')
            should(config.intervals[0].skip).be.false()
            should(config.intervals[0].duration).be.equal(60)

            should(config.intervals[1].constructor.name).be.equal('Interval')
            should(config.intervals[1].set).be.equal(1)
            should(config.intervals[1].phase).be.equal('two')
            should(config.intervals[1].skip).be.true()
            should(config.intervals[1].duration).be.equal(120)

            done()
        })

        describe('events', () => {
            it('start and end of session', done => {
                let config = new Config({
                    name: 'start-end-session',
                    fixed: false,
                    sets: [
                        {phases: [{name: 'one', duration: 60, skip: false}]}
                    ],
                    events: [
                        {name: 'alpha', time: -10},
                        {name: 'bravo', time: 10}
                    ]
                })

                let events = config.events

                should(events[10]).not.be.undefined()
                should(events[10].constructor.name).be.equal('Array')
                should(events[10]).be.length(1)

                should(events[10][0].meta.set).be.null()
                should(events[10][0].meta.phase).be.null()
                should(events[10][0].event.name).be.equal('bravo')
                should(events[10][0].event.time).be.equal(10)

                should(events[50]).not.be.undefined()
                should(events[50].constructor.name).be.equal('Array')
                should(events[50]).be.length(1)

                should(events[50][0].meta.set).be.null()
                should(events[50][0].meta.phase).be.null()
                should(events[50][0].event.name).be.equal('alpha')
                should(events[50][0].event.time).be.equal(-10)

                done()
            })

            it('start and end of set', done => {
                let config = new Config({
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
                })

                let events = config.events

                should(events[10]).not.be.undefined()
                should(events[10].constructor.name).be.equal('Array')
                should(events[10]).be.length(1)

                should(events[10][0].meta.set).be.equal(0)
                should(events[10][0].meta.phase).be.null()
                should(events[10][0].event.name).be.equal('bravo')
                should(events[10][0].event.time).be.equal(10)

                should(events[50]).not.be.undefined()
                should(events[50].constructor.name).be.equal('Array')
                should(events[50]).be.length(1)

                should(events[50][0].meta.set).be.equal(0)
                should(events[50][0].meta.phase).be.null()
                should(events[50][0].event.name).be.equal('alpha')
                should(events[50][0].event.time).be.equal(-10)

                done()
            })

            it('start or end of phase', done => {
                let config = new Config({
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
                })

                let events = config.events

                should(events[10]).not.be.undefined()
                should(events[10].constructor.name).be.equal('Array')
                should(events[10]).be.length(1)

                should(events[10][0].meta.set).be.equal(0)
                should(events[10][0].meta.phase).be.equal('one')
                should(events[10][0].event.name).be.equal('bravo')
                should(events[10][0].event.time).be.equal(10)

                should(events[50]).not.be.undefined()
                should(events[50].constructor.name).be.equal('Array')
                should(events[50]).be.length(1)

                should(events[50][0].meta.set).be.equal(0)
                should(events[50][0].meta.phase).be.equal('one')
                should(events[50][0].event.name).be.equal('alpha')
                should(events[50][0].event.time).be.equal(-10)

                done()
            })

            it('multiple phases', done => {
                let config = new Config({
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
                })

                let events = config.events

                should(events[10]).not.be.undefined()
                should(events[10].constructor.name).be.equal('Array')
                should(events[10]).be.length(1)

                should(events[10][0].meta.set).be.equal(0)
                should(events[10][0].meta.phase).be.equal('one')
                should(events[10][0].event.name).be.equal('alpha')
                should(events[10][0].event.time).be.equal(10)

                should(events[50]).not.be.undefined()
                should(events[50].constructor.name).be.equal('Array')
                should(events[50]).be.length(1)

                should(events[50][0].meta.set).be.equal(0)
                should(events[50][0].meta.phase).be.equal('two')
                should(events[50][0].event.name).be.equal('bravo')
                should(events[50][0].event.time).be.equal(-10)

                done()
            })
        })

        it('events', done => {
            let config = new Config({
                name: 'test',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {
                                name: 'one',
                                duration: 60,
                                skip: false,
                                events: [
                                    {
                                        name: 'alpha',
                                        time: -10
                                    },
                                    {
                                        name: 'bravo',
                                        time: 10
                                    }
                                ]
                            },
                            {
                                name: 'two',
                                duration: 30,
                                skip: false,
                                events: [
                                    {
                                        name: 'charlie',
                                        time: -10
                                    },
                                    {
                                        name: 'delta',
                                        time: 10
                                    }
                                ]
                            }
                        ],
                        events: [
                            {
                                name: 'echo',
                                time: -10
                            },
                            {
                                name: 'foxtrot',
                                time: 10
                            }
                        ]
                    },
                    {
                        phases: [
                            {
                                name: 'three',
                                duration: 120,
                                skip: true,
                                events: [
                                    {
                                        name: 'gulf',
                                        time: 10
                                    },
                                    {
                                        name: 'hotel',
                                        time: -10
                                    }
                                ]
                            },
                            {
                                name: 'four',
                                duration: 60,
                                skip: true,
                                events: [
                                    {
                                        name: 'india',
                                        time: 10
                                    },
                                    {
                                        name: 'juliet',
                                        time: -10
                                    }
                                ]
                            }
                        ],
                        events: [
                            {
                                name: 'kilo',
                                time: 10
                            },
                            {
                                name: 'lima',
                                time: -10
                            }
                        ]
                    }
                ],
                events: [
                    {
                        name: 'mike',
                        time: 10
                    },
                    {
                        name: 'november',
                        time: -10
                    }
                ]
            })

            should(config.events[10].constructor.name).be.equal('Array')
            should(config.events[10]).be.length(3)

            should(config.events[50].constructor.name).be.equal('Array')
            should(config.events[50]).be.length(1)

            should(config.events[70].constructor.name).be.equal('Array')
            should(config.events[70]).be.length(1)

            should(config.events[70].constructor.name).be.equal('Array')
            should(config.events[70]).be.length(1)

            should(config.events[80].constructor.name).be.equal('Array')
            should(config.events[80]).be.length(2)

            should(config.events[80].constructor.name).be.equal('Array')
            should(config.events[80]).be.length(2)

            should(config.events[100].constructor.name).be.equal('Array')
            should(config.events[100]).be.length(2)

            should(config.events[200].constructor.name).be.equal('Array')
            should(config.events[200]).be.length(1)

            should(config.events[220].constructor.name).be.equal('Array')
            should(config.events[220]).be.length(1)

            should(config.events[260].constructor.name).be.equal('Array')
            should(config.events[260]).be.length(3)

            done()
        })
    })

    // todo - add config tests
})