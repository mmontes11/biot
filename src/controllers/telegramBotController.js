import { AuthController } from "./authController"
import { ThingsController } from "./thingsController";
import { MarkdownBuilder } from '../helpers/markdownBuilder';

export class TelegramBotController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.authController = new AuthController(telegramBot);
        this.thingsController = new ThingsController(telegramBot, iotClient);
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
                const chatId = msg.chat.id;
                const markdown = MarkdownBuilder.buildDefaultMessageMD();
                const options = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                };
                this.bot.sendMessage(chatId, markdown, options);
            }
        });
    }
}