export default class Index {
    constructor () {
        this.index = {}
    }
    add (event) {
        let key = event.data.attributes.time

        if (!Array.isArray(this.index[key])) this.index[key] = []

        this.index[key].push(event)
    }
    get (key) {
        return Array.isArray(this.index[key]) ? this.index[key] : [];
    }
}