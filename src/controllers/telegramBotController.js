import { ThingsController } from "./thingsController"

export class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.thingsController = new ThingsController(telegramBot, iotClient);
    }
    listen() {
        this.bot.on('message', (msg) => {
            const text = msg.text;
            if (/\/things/.test(text)) {
                this.thingsController.handleMessage(msg);
            }
        });
    }
}