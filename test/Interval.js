import Interval from "../src/Interval"
import sinon from "sinon"
import should from "should"

describe('Interval', () => {
    it('supports optional duration argument', done => {
        let intervalA = new Interval
        let intervalB = new Interval(500)
        should(intervalA.duration).be.equal(1000)
        should(intervalB.duration).be.equal(500)
        done()
    })

    describe('getNextTick', () => {
        it('gets milliseconds to next duration elapsed', done => {
            let interval = new Interval

            sinon.stub(Interval, 'getTimestamp').returns(10250)

            should(interval.getNextTick()).be.equal(1000)

            Interval.getTimestamp.returns(11200)

            should(interval.getNextTick()).be.equal(1050)

            Interval.getTimestamp.restore()

            done()
        })
    })

    describe('start', () => {
        it('calls run', done => {
            let interval = new Interval

            let run = sinon.stub(interval, 'run')

            should(interval.id).be.equal(null)

            interval.start()

            should(run.called).be.true()

            done()
        })

        it('cannot be started twice', done => {
            let interval = new Interval

            interval.id = 1234

            let run = sinon.stub(interval, 'run')

            interval.start()

            should(run.called).be.false()

            done()
        })
    })

    describe('pause', () => {
        it('clears timeout and sets remainder', done => {
            let interval = new Interval

            sinon.stub(Interval, 'getTimestamp').returns(10000)
            sinon.stub(interval, 'getNextTick').returns(980)
            let run = sinon.stub(interval, 'run')

            interval.start()

            interval.id = 1234

            interval.pause()

            should(interval.id).be.equal(null)
            should(interval.remainder).be.equal(20)

            Interval.getTimestamp.returns(15000)

            interval.start()

            should(run.calledWith(null, 20))

            Interval.getTimestamp.restore()

            done()
        })
    })

    describe('run', () => {
        it('emits tick events and stops after timeout cleared', done => {
            let interval = new Interval(15)

            let tick = sinon.stub(interval, 'tick')

            interval.addListener('tick', tick)

            interval.run()

            setTimeout(() => {
                clearTimeout(interval.id)

                should(tick.called).be.true()

                done()
            }, 30)
        })
    })

    describe('stop', () => {
        it('clears timeout and calls init', done => {
            let interval = new Interval

            interval.id = 1234

            let init = sinon.stub(interval, 'init')

            interval.stop()

            should(init.called).be.true()

            done()
        })

        it('cannot run if already stopped', done => {
            let interval = new Interval

            let init = sinon.stub(interval, 'init')

            interval.stop()

            should(init.called).be.false()

            done()
        })
    })

    describe('run', () => {
        it('ticks once per second', function(done) {
            this.timeout(4100)

            let interval = new Interval

            let tick = sinon.spy()
            interval.addListener('tick', tick)

            interval.start()

            setTimeout(() => {
                should(tick.callCount).be.equal(4)

                interval.stop()

                done()
            }, 4020)
        })
    })
})