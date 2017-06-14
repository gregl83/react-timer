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
        it('sets started timestamp and calls run', done => {
            let interval = new Interval

            sinon.stub(Interval, 'getTimestamp').returns(10250)
            let run = sinon.stub(interval, 'run')

            should(interval.started).be.equal(null)
            should(interval.id).be.equal(null)

            interval.start()

            should(run.called).be.true()
            should(interval.started).be.equal(10250)

            Interval.getTimestamp.restore()

            done()
        })

        it('cannot be started twice', done => {
            let interval = new Interval

            interval.id = 1234

            let run = sinon.stub(interval, 'run')

            interval.start()

            should(run.called).be.false()
            should(interval.started).be.equal(null)

            done()
        })
    })

    describe('pause', () => {
        // todo test pause with remainder and start
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
})