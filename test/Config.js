import Config from "../src/Config"
import sinon from "sinon"
import should from "should"

describe('Config', () => {
    it('initializes intervals', done => {
        let config = new Config({
            name: 'test',
            fixed: false,
            sets: [
                {
                    phases: [
                        {
                            name: "one",
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
                            name: "two",
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

    // todo - add config tests
})