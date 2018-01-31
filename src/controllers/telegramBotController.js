import { AuthController } from "./authController"
import { ThingsController } from "./thingsController";
import { DefaultMessageController } from "./defaultMessageController";

export class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.authController = new AuthController(telegramBot);
        this.thingsController = new ThingsController(telegramBot, iotClient);
        this.defaultMessageController = new DefaultMessageController(telegramBot);
    }
    listen() {
        this.bot.on('message', (msg) => {
            if (!this.authController.isAuthorized(msg)) {
                this.authController.sendNotAuthorizedMessage(msg);
                return;
            }
            let handledMessage = false;
            const text = msg.text;
            if (/\/things/.test(text)) {
                this.thingsController.handleMessage(msg);
                handledMessage = true;
            }
            if (!handledMessage) {
                this.defaultMessageController.sendDefaultMessage(msg);
            }
        });
    }
}