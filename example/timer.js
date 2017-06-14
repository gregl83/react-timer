import Timer from "../"
import config from "./config"

let timer = new Timer(config)

timer.addListener('started', () => console.log('started'))

timer.addListener('ticked', () => console.log('ticked', timer.props))

timer.addListener('paused', () => console.log('paused'))

timer.addListener('stopped', () => console.log('stopped'))

timer.addListener('reset', () => console.log('reset'))

timer.start()