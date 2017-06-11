import Timer from "../"
import should from "should"

describe('Timer', function() {
    it('state is ready with new instance', function(done) {
        let timer = new Timer()

        setTimeout(function() {
            should(timer.is(Timer.states.READY)).be.true()
            should(timer.is(Timer.states.STARTED)).be.false()
            should(timer.is(Timer.states.PAUSED)).be.false()
            should(timer.is(Timer.states.STOPPED)).be.false()
            done()
        }, 1500)
    })

    // todo add timer expectations / assertions
})