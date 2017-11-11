export default class EventMeta {
    constructor (set, phase) {
        this.set = set
        if (Number.isInteger(phase)) this.phase = phase
    }
}