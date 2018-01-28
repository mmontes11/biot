import _ from 'underscore';
import httpStatus from 'http-status';
import bot from './lib/telgramBot';
import iotClient from './lib/iotClient';
import { MarkdownBuilder } from './helpers/markdownBuilder';
import errorMessages from './util/errorMessages';

bot.onText(/\/things/, (msg, match) => {
    const chatId = msg.chat.id;

    iotClient.thingsService.getThings()
        .then((res) => {
            const things = res.body.things;
            const markdown = MarkdownBuilder.buildThingsListMD(things);
            const options = {
                parse_mode:"Markdown"
            };
            bot.sendMessage(chatId, markdown, options);
        })
        .catch((err) => {
            if (_.isEqual(err.statusCode, httpStatus.NOT_FOUND)) {
                bot.sendMessage(chatId, errorMessages.noThingsAvailable);
            } else {
                bot.sendMessage(chatId, errorMessages.errorGettingThings);
            }
        });
});