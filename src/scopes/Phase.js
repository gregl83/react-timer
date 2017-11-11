import Base from "./Base"

export default class Phase extends Base {
    constructor (set, name, duration, skip, events) {
        super(duration, events)
        this.set = set
        this.name = name
        this.skip = skip
    }
}