import _ from 'underscore';
import httpStatus from 'http-status';
import messages from '../utils/messages';

export class ResponseHandler {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleCreateSubscriptionResponse(res, chatId) {
        if (_.isEqual(res.statusCode, httpStatus.NOT_MODIFIED)) {
            this.bot.sendMessage(chatId, messages.alreadySubscribedMessage)
        } else {
            this.bot.sendMessage(chatId, messages.successSubscribingMessage);
        }
    }
}