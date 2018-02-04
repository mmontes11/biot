import commandMessages from '../util/commandMessages';
import _ from 'underscore';
import { StatsCriteria } from '../model/statsCriteria';

export class StatsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.availableStatsCriteria = [ StatsCriteria.addressStatsCriteria(), StatsCriteria.thingStatsCriteria() ];
    }
    handleMessage(msg) {
        const chatId = msg.chat.id;
        const inlineKeyboards = _.map(this.availableStatsCriteria, (availableStatsCriteria) => {
            return {
                text: availableStatsCriteria.name,
                callback_data: availableStatsCriteria.id
            };
        });
        const options = {
            reply_markup: {
                inline_keyboard: [ inlineKeyboards ]
            }
        };
        this.bot.sendMessage(chatId, commandMessages.statsByMessage, options);
    }
    handleCallbackQuery(callbackQuery) {
        console.log(callbackQuery);
        const chatId = callbackQuery.message.chat.id;
        const options = {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: "Day",
                        callback_data: "Day"
                    },
                    {
                        text: "Week",
                        callback_data: "Week"
                    }
                ]]
            }
        };
        this.bot.sendMessage(chatId, commandMessages.timePeriodSelectMessage, options);
        this.bot.answerCallbackQuery(callbackQuery.id);
    }
}