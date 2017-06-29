import Timer from "../"
import config from "./config"

let timer = new Timer(config)

// timer events - utilizes timer ui
timer.addListener('ticked', () => console.log('ticked', timer.props))

timer.addListener('started', () => {
    console.log('started', timer.props)

    if (!timer.props.session.elapsed) setTimeout(() => timer.pause(), 3000)
    else setTimeout(() => timer.skip(), 3000)
})

timer.addListener('paused', () => {
    console.log('paused', timer.props)

    setTimeout(() => timer.start(), 3000)
})

timer.addListener('skipped', () => {
    setTimeout(() => timer.stop(), 3000)
})

timer.addListener('stopped', () => {
    console.log('stopped', timer.props)

    setTimeout(() => timer.reset(), 1000)
})

timer.addListener('reset', () => console.log('reset', timer.props))

function handler (event) {
    console.log(event.data.attributes.name, timer.props)
}

// session events
timer.addListener('session.started', handler)
timer.addListener('session.finished', handler)

// set events
timer.addListener('set.started', handler)
timer.addListener('set.finished', handler)

// phase events
timer.addListener('phase.started', handler)
timer.addListener('phase.finished', handler)

// custom events
timer.addListener('alpha-reminder', handler)
timer.addListener('bravo-reminder', handler)
timer.addListener('set-reminder', handler)
timer.addListener('session-reminder', handler)

timer.start()