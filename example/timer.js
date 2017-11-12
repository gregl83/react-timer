import Timer from "../"
import config from "./config"

let timer = new Timer(config)

function logEvent(event) {
    console.log(event.data.attributes.name)
    console.log(JSON.stringify(timer.props), "\r\n")
}

// timer events - utilizes timer ui
timer.addListener('ticked', logEvent)

timer.addListener('started', event => {
    logEvent(event)
    if (!timer.props.session.elapsed) setTimeout(() => timer.pause(), 3000)
    else setTimeout(() => timer.skip(), 3000)
})

timer.addListener('paused', event => {
    logEvent(event)
    setTimeout(() => timer.start(), 3000)
})

timer.addListener('skipped', event => {
    logEvent(event)
    setTimeout(() => timer.stop(), 3000)
})

timer.addListener('stopped', event => {
    logEvent(event)
    setTimeout(() => timer.reset(), 1000)
})

timer.addListener('reset', logEvent)

// session events
timer.addListener('session.started', logEvent)
timer.addListener('session.finished', logEvent)

// set events
timer.addListener('set.started', logEvent)
timer.addListener('set.finished', logEvent)

// phase events
timer.addListener('phase.started', logEvent)
timer.addListener('phase.finished', logEvent)

// custom events
timer.addListener('alpha-reminder', logEvent)
timer.addListener('bravo-reminder', logEvent)
timer.addListener('set-reminder', logEvent)
timer.addListener('session-reminder', logEvent)

timer.start()