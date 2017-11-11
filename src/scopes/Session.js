import Base from "./Base"

export default class Session extends Base {
    constructor (name, type, duration, events) {
        super(duration, events)
        this.name = name
        this.setType(type)
    }
    static get types () {
        return [
            'constant',
            'dynamic',
        ]
    }
    setType (type) {
        if (!Session.types.includes(type)) throw new Error('invalid session type')
        this.type = type
    }
}