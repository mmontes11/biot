import commandMessages from '../util/commandMessages';

export class StatsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
    }
    handleMessage(msg) {
        const chatId = msg.chat.id;
        const options = {
            reply_markup: {
                inline_keyboard: [[
                    {
                        text: "Address",
                        callback_data: "Address"
                    },
                    {
                        text: "Thing",
                        callback_data: "Thing"
                    }
                ]]
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