import _ from 'underscore';
import httpStatus from 'http-status';
import messages from '../utils/messages';
import { MarkdownBuilder } from '../helpers/markdownBuilder';

export class ResponseHandler {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleCreateSubscriptionResponse(res, chatId) {
        const topic = res.body.topic;
        const markdown = MarkdownBuilder.buildSubscriptionSuccessMD(topic);
        const options = {
            parse_mode: "Markdown"
        };
        this.bot.sendMessage(chatId, markdown, options);
    }
}