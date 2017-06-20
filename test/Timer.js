import Timer from "../"
import sinon from "sinon"
import should from "should"

let config = {
    name: 'test',
    fixed: false,
    sets: [],
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

    // todo add timer expectations / assertions
})