export class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
    }
    async listen() {
        const bot = this.bot;
        const iotClient = this.iotClient;

        bot.onText(/\/things/, (msg, match) => {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'WIP: Getting things...');
        });

        bot.onText(/\/stats/, (msg, match) => {
            const chatId = msg.chat.id;
            bot.sendMessage(chatId, 'WIP: Getting stats...');
        });
    }
}