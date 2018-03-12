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
        return {
            chatId: this.chatId,
            notificationType: this.notificationType,
            thing: this.thing,
            observationType: this.observationType
        };
    }
}
