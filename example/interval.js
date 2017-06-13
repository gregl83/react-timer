import Interval from "../src/Interval"

let interval = new Interval

interval.addListener('tick', () => {
    let date = new Date
    let dateStamp = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds()
    console.log(`[${dateStamp}] tick event received`)
})

interval.start()