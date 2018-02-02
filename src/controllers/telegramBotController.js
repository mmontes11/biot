import { AuthController } from "./authController"
import { ThingsController } from "./thingsController";
import { DefaultMessageController } from "./defaultMessageController";
import { StatsController } from "./statsController";
import { Log } from '../util/log';

export class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.authController = new AuthController(telegramBot);
        this.thingsController = new ThingsController(telegramBot, iotClient);
        this.statsController = new StatsController(telegramBot, iotClient);
        this.defaultMessageController = new DefaultMessageController(telegramBot);
        this.log = new Log(process.env.BIOT_DEBUG);
    }
    listen() {
        this.bot.on('message', (msg) => {
            try {
                this.log.logMessage(msg);
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
                if (/\/stats/.test(text)) {
                    this.statsController.handleMessage(msg);
                    handledMessage = true;
                }
                if (!handledMessage) {
                    this.defaultMessageController.sendDefaultMessage(msg);
                }
            } catch (err) {
                this.log.logError(err);
            }
        });

        this.bot.on('callback_query', (callbackQuery) => {
            console.log(callbackQuery);
            this.statsController.handleCallbackQuery(callbackQuery);
        });

        this.bot.on('polling_error', (err) => {
            this.log.logError(err);
        });
    }
}