import Timer from "../"
import should from "should"

describe('Timer', function() {
    it('not running prior to calling start', function(done) {
        let timer = new Timer()

        setTimeout(function() {
            should(timer.props.running).be.false()

            // todo add more prop checks

            done()
        }, 1100)
    })

    // todo add timer expectations / assertions
})