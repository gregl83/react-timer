import Timer from "../"
import sinon from "sinon"
import should from "should"

let config = {
    name: 'test',
    fixed: false,
    sets: [{phases: [{name: 'one', duration: 60, skip: false}]}],
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
                done()
            }, 20)
        })

        it('paused event emitted', done => {
            let timer = new Timer(config)

            let skip = sinon.spy()

            timer.addListener('skipped', skip)

            timer.start()
            timer.skip()

            setTimeout(() => {
                should(skip.called).be.true()
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
                done()
            }, 20)
        })
    })

    describe('non-fixed config', () => {
        it('completes run', function(done) {
            this.timeout(3020)

            let config = {
                name: 'test',
                fixed: false,
                sets: [
                    {
                        phases: [
                            {name: 'one', duration: 1, skip: false},
                            {name: 'two', duration: 1, skip: false, events: [{name: 'phase-two', time: 1}]}
                        ],
                        events: [{name: 'set-one', time: -2}]
                    },
                    {
                        phases: [
                            {name: 'three', duration: 1, skip: false},
                            {name: 'four', duration: 1, skip: false, events: [{name: 'phase-four', time: 1}]}
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

            timer.addListener('stopped', () => {
                should(start.callCount).be.equal(2)

                should(tick.callCount).be.equal(3)

                should(pause.callCount).be.equal(1)

                should(skip.callCount).be.equal(1)

                should(timer.props.session.elapsed).be.equal(3)

                done()
            })

            timer.start()

            setTimeout(() => {
                timer.pause()

                setTimeout(() => {
                    timer.start()
                }, 500)
            }, 500)

            setTimeout(() => {
                timer.skip()
            }, 1750)
        })
    })

    describe('fixed config', () => {
        // todo add timer expectations / assertions
    })
})