import _ from 'underscore';

export class SubscriptionParams {
    constructor(chatId) {
        this.chatId = chatId;
    }
    setNotificationType(notificationType) {
        this.notificationType = notificationType;
    }
    setThing(thing) {
        this.thing = thing;
    }
    setObservationType(observationType) {
        this.observationType = observationType;
    }
    toJSON() {
        const json = {};
        if (!_.isUndefined(this.chatId)) {
            json['chatId'] = this.chatId;
        }
        if (!_.isUndefined(this.notificationType)) {
            json['type'] = this.notificationType;
        }
        if (!_.isUndefined(this.thing)) {
            json['thing'] = this.thing.name;
        }
        if (!_.isUndefined(this.observationType)) {
            json['observationType'] = this.observationType;
        }
        return json;
    }
}
