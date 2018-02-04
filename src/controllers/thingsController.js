import { MarkdownBuilder } from '../helpers/markdownBuilder';
import errorMessages from '../util/errorMessages';

export class ThingsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
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
                if (_.isEqual(err.statusCode, httpStatus.NOT_FOUND)) {
                    this.bot.sendMessage(chatId, errorMessages.noThingsAvailable);
                } else {
                    this.bot.sendMessage(chatId, errorMessages.errorGettingThings);
                }
            });
    }
}