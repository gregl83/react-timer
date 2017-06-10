export default class Timeout {
    set (callback, delay) {
        setTimeout(callback, delay)
    }
}