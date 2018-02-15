import { AuthController } from "./authController"
import { ThingsController } from "./thingsController";
import { DefaultMessageController } from "./defaultMessageController";
import { StatsController } from "./statsController";
import { NotificationsController } from "./notificationsController"
import { CallbackData } from "../../models/callbackData";
import telegramBot from '../../lib/telgramBot';
import iotClient from '../../lib/iotClient';
import log from '../../utils/log';

class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.authController = new AuthController(telegramBot);
        this.thingsController = new ThingsController(telegramBot, iotClient);
        this.statsController = new StatsController(telegramBot, iotClient);
        this.defaultMessageController = new DefaultMessageController(telegramBot);
        this.notificationsController = new NotificationsController(telegramBot);
    }
    listen() {
        log.logInfo("Telegram bot started polling");

        this.bot.on('message', (msg) => {
            try {
                log.logMessage(msg);
                if (!this.authController.isAuthorized(msg)) {
                    this.authController.sendNotAuthorizedMessage(msg);
                    return;
                }
                let handledMessage = false;
                const text = msg.text;
                if (/\/things/.test(text)) {
                    this.thingsController.handleThingsCommand(msg);
                    handledMessage = true;
                }
                if (/\/stats/.test(text)) {
                    this.statsController.handleStatsCommand(msg);
                    handledMessage = true;
                }
                if (!handledMessage) {
                    this.defaultMessageController.sendDefaultMessage(msg);
                }
            } catch (err) {
                log.logError(err);
            }
        });

        this.bot.on('callback_query', (callbackQuery) => {
            log.logCallbackQuery(callbackQuery);
            let callbackData = CallbackData.deserialize(callbackQuery.data);
            if (StatsController.canHandleCallbackData(callbackData)) {
                this.statsController.handleCallbackQuery(callbackQuery, callbackData);
            }
        });

        this.bot.on('polling_error', (err) => {
            log.logError(err);
        });
    }
    handleNotifications(notifications) {
        this.notificationsController.handleNotifications(notifications);
    }
    async stop() {
        try {
            await this.bot.stopPolling();
            log.logInfo("Telegram bot stopped polling");
        } catch (err) {
            log.logError("Telegram bot error stopping polling");
            log.logError(err);
        }
    }
}

const telegramBotController = new TelegramBotController(telegramBot, iotClient);

export default telegramBotController;