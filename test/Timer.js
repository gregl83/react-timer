import Timer from "../"
import sinon from "sinon"
import should from "should"

let config = {
    name: 'test',
    type: 'dynamic',
    sets: [{phases: [{name: 'one', duration: 60, skip: true}]}],
    events: []
}

describe('Timer', () => {
    it('state is ready with new instance', done => {
        let timer = new Timer(config)

        setTimeout(() => {
            should(timer.is(Timer.states.READY)).be.true()
            should(timer.is(Timer.states.STARTED)).be.false()
            should(timer.is(Timer.states.PAUSED)).be.false()
            should(timer.is(Timer.states.STOPPED)).be.false()
            done()
        }, 20)
    })

    describe('events', () => {
        it('started event emitted', done => {
            let timer = new Timer(config)

            let start = sinon.spy()

            timer.addListener('started', start)

            timer.start()

            setTimeout(() => {
                should(start.called).be.true()

                timer.stop()

                done()
            }, 20)
        })

        it('ticked event emitted', done => {
            let timer = new Timer(config)

            let ticked = sinon.spy()

            timer.addListener('ticked', ticked)

            timer.start()

            setTimeout(() => {
                should(ticked.called).be.true()

                timer.stop()

                done()
            }, 1020)
        })

        it('paused event emitted', done => {
            let timer = new Timer(config)

            let pause = sinon.spy()

            timer.addListener('paused', pause)

            timer.start()
            timer.pause()

            setTimeout(() => {
                should(pause.called).be.true()

                timer.stop()

                done()
            }, 20)
        })

        it('skipped event emitted', done => {
            let timer = new Timer(config)

            let skip = sinon.spy()

            timer.addListener('skipped', skip)

            timer.start()
            timer.skip()

            setTimeout(() => {
                should(skip.called).be.true()

                timer.stop()

                done()
            }, 20)
        })

        it('stopped event emitted', done => {
            let timer = new Timer(config)

            let stop = sinon.spy()

            timer.addListener('stopped', stop)

            timer.start()
            timer.stop()

            setTimeout(() => {
                should(stop.called).be.true()
                done()
            }, 20)
        })

        it('reset event emitted', done => {
            let timer = new Timer(config)

            let reset = sinon.spy()

            timer.addListener('reset', reset)

            timer.start()
            timer.reset()

            setTimeout(() => {
                should(reset.called).be.true()

                timer.stop()
                done()
            }, 20)
        })
    })

    describe('runs', () => {
        it('skips with non-fixed duration', function(done) {
            return done() // fixme
            this.timeout(6750)

            let config = {
                name: 'test',
                type: 'dynamic',
                sets: [
                    {
                        phases: [
                            {name: 'one', duration: 2, skip: false},
                            {name: 'two', duration: 2, skip: false, events: [{name: 'phase-two', time: 1}]}
                        ],
                        events: [{name: 'set-one', time: -2}]
                    },
                    {
                        phases: [
                            {name: 'three', duration: 2, skip: false},
                            {name: 'four', duration: 2, skip: false, events: [{name: 'phase-four', time: 1}]}
                        ],
                        events: [{name: 'set-two', time: -2}]
                    }
                ],
                events: [{name: 'session', time: 2}]
            }

            let timer = new Timer(config)

            let start = sinon.spy()
            timer.addListener('started', start)

            let tick = sinon.spy()
            timer.addListener('ticked', tick)

            let pause = sinon.spy()
            timer.addListener('paused', pause)

            let skip = sinon.spy()
            timer.addListener('skipped', skip)

            let sessionStarted = sinon.spy()
            timer.addListener('session.started', sessionStarted)

            let sessionFinished = sinon.spy()
            timer.addListener('session.finished', sessionFinished)

            let setStarted = sinon.spy()
            timer.addListener('set.started', setStarted)

            let setFinished = sinon.spy()
            timer.addListener('set.finished', setFinished)

            let phaseStarted = sinon.spy()
            timer.addListener('phase.started', phaseStarted)

            let phaseFinished = sinon.spy()
            timer.addListener('phase.finished', phaseFinished)

            let phaseTwo = sinon.spy()
            timer.addListener('phase-two', phaseTwo)

            let phaseFour = sinon.spy()
            timer.addListener('phase-four', phaseFour)

            timer.addListener('stopped', () => {
                should(start.callCount).be.equal(2)

                should(tick.callCount).be.equal(7)

                should(pause.callCount).be.equal(1)

                should(skip.callCount).be.equal(1)

                should(sessionStarted.callCount).be.equal(1)

                should(sessionFinished.callCount).be.equal(1)

                should(setStarted.callCount).be.equal(2)

                should(setFinished.callCount).be.equal(2)

                should(phaseStarted.callCount).be.equal(4)

                should(phaseFinished.callCount).be.equal(4)

                should(phaseTwo.callCount).be.equal(1)

                should(phaseFour.callCount).be.equal(1)

                should(timer.props.session.elapsed).be.equal(7)

                done()
            })

            timer.start()

            setTimeout(() => {
                timer.pause()

                setTimeout(() => {
                    timer.start()
                }, 520)
            }, 1020)

            setTimeout(() => {
                timer.skip()
            }, 2750)
        })

        it('skips with fixed duration', function(done) {
            return done() // fixme

            this.timeout(10750)

            let config = {
                name: 'test',
                type: 'constant',
                sets: [
                    {
                        phases: [
                            {name: 'one', duration: 2, skip: false},
                            {name: 'two', duration: 2, skip: false, events: [{name: 'phase-two', time: 1}]}
                        ],
                        events: [{name: 'set-one', time: -2}]
                    },
                    {
                        phases: [
                            {name: 'three', duration: 2, skip: false},
                            {name: 'four', duration: 2, skip: false, events: [{name: 'phase-four', time: 1}]}
                        ],
                        events: [{name: 'set-two', time: -2}]
                    }
                ],
                events: [{name: 'session', time: 2}]
            }

            let timer = new Timer(config)

            let start = sinon.spy()
            timer.addListener('started', start)

            let tick = sinon.spy()
            timer.addListener('ticked', tick)

            let pause = sinon.spy()
            timer.addListener('paused', pause)

            let skip = sinon.spy()
            timer.addListener('skipped', skip)

            let sessionStarted = sinon.spy()
            timer.addListener('session.started', sessionStarted)

            let sessionFinished = sinon.spy()
            timer.addListener('session.finished', sessionFinished)

            let setStarted = sinon.spy()
            timer.addListener('set.started', setStarted)

            let setFinished = sinon.spy()
            timer.addListener('set.finished', setFinished)

            let phaseStarted = sinon.spy()
            timer.addListener('phase.started', phaseStarted)

            let phaseFinished = sinon.spy()
            timer.addListener('phase.finished', phaseFinished)

            let phaseTwo = sinon.spy()
            timer.addListener('phase-two', phaseTwo)

            let phaseFour = sinon.spy()
            timer.addListener('phase-four', phaseFour)

            timer.addListener('stopped', () => {
                should(start.callCount).be.equal(2)

                should(tick.callCount).be.equal(8)

                should(pause.callCount).be.equal(1)

                should(skip.callCount).be.equal(1)

                should(sessionStarted.callCount).be.equal(1)

                should(sessionFinished.callCount).be.equal(1)

                should(setStarted.callCount).be.equal(2)

                should(setFinished.callCount).be.equal(2)

                should(phaseStarted.callCount).be.equal(4)

                should(phaseFinished.callCount).be.equal(4)

                should(phaseTwo.callCount).be.equal(1)

                should(phaseFour.callCount).be.equal(1)

                should(timer.props.session.elapsed).be.equal(8)

                done()
            })

            timer.start()

            setTimeout(() => {
                timer.pause()

                setTimeout(() => {
                    timer.start()
                }, 520)
            }, 1020)

            setTimeout(() => {
                timer.skip()
            }, 2750)
        })
    })

    // todo - skip false handling
})