import _ from 'underscore';

export class StatsParams {
    constructor(chatId) {
        this.chatId = chatId;
    }
    setThing(thing) {
        this.thing = thing;
    }
    setTimePeriod(timePeriod) {
        this.timePeriod = timePeriod;
    }
    toJSON() {
        const json = {};
        if (!_.isUndefined(this.thing)) {
            json['thing'] = this.thing
        }
        if (!_.isUndefined(this.timePeriod)) {
            json['timePeriod'] = this.timePeriod
        }
        return json;
    }
}
