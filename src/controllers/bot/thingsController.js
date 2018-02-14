import { MarkdownBuilder } from '../../helpers/markdownBuilder';
import { ErrorHandler } from '../../helpers/errorHandler';
import errorMessages from '../../utils/errorMessages';

export class ThingsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.errorHandler = new ErrorHandler(telegramBot);
    }
    async handleThingsCommand(msg) {
        const chatId = msg.chat.id;
        try {
            const response = await this.iotClient.thingsService.getThings();
            const things = response.body.things;
            const markdown = MarkdownBuilder.buildThingsListMD(things);
            const options = {
                parse_mode: "Markdown",
                disable_web_page_preview: true
            };
            this.bot.sendMessage(chatId, markdown, options);
        } catch (err) {
            this.errorHandler.handleThingsError(err, chatId);
        }
    }
}