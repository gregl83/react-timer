import Interval from "../src/Interval"

function log(message) {
    let date = new Date
    let dateStamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()
    console.log(`[${dateStamp}] ${message}`)
}

let interval = new Interval

let elapsed = 0
interval.addListener('tick', () => {
    log(`tick ${++elapsed} second(s) elapsed`)
})

log(`starting`)

interval.start()

setTimeout(() => {
    log(`pausing`)

    interval.pause()

    setTimeout(() => {
        log(`stopping`)

        interval.stop()
    }, 1015)
}, 10015)