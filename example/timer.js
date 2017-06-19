import Timer from "../"
import config from "./config"

let timer = new Timer(config)

timer.addListener('ticked', () => console.log('ticked', timer.props))

timer.addListener('started', () => {
    console.log('started', timer.props)

    if (!timer.props.elapsed) setTimeout(() => timer.pause(), 3000)
    else setTimeout(() => timer.stop(), 3000)
})

timer.addListener('paused', () => {
    console.log('paused', timer.props)

    setTimeout(() => timer.start(), 3000)
})

timer.addListener('stopped', () => {
    console.log('stopped', timer.props)

    setTimeout(() => timer.reset(), 1000)
})

timer.addListener('reset', () => console.log('reset', timer.props))

timer.start()