export default class Event {
    constructor (meta, name, time) {
        if (meta) this.meta = meta
        this.data = {
            attributes: {
                name,
                time
            }
        }
    }
}