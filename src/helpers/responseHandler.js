import _ from 'underscore';
import httpStatus from 'http-status';
import messages from '../utils/messages';
import { MarkdownBuilder } from '../helpers/markdownBuilder';

export class ResponseHandler {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleCreateSubscriptionResponse(res, chatId, subscription) {
        let markdown;
        if (_.isEqual(res.statusCode, httpStatus.NOT_MODIFIED)) {
            markdown = MarkdownBuilder.buildSubscriptionSuccessMD(subscription)
        } else {
            markdown = MarkdownBuilder.buildAlreadySubscribedMD(subscription);
        }
        const options = {
            parse_mode: "Markdown"
        };
        this.bot.sendMessage(chatId, markdown, options);
    }
}