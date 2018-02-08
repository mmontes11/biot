import { MarkdownBuilder } from '../helpers/markdownBuilder';
import { ErrorHandler } from '../helpers/errorHandler';
import errorMessages from '../utils/errorMessages';

export class ThingsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.errorHandler = new ErrorHandler(telegramBot);
    }
    handleThingsCommand(msg) {
        const chatId = msg.chat.id;
        this.iotClient.thingsService.getThings()
            .then((res) => {
                const things = res.body.things;
                const markdown = MarkdownBuilder.buildThingsListMD(things);
                const options = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                };
                this.bot.sendMessage(chatId, markdown, options);
            })
            .catch((err) => {
                this.errorHandler.handleThingsError(err, chatId);
            });
    }
}