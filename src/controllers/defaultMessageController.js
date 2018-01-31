import { MarkdownBuilder } from '../helpers/markdownBuilder';

export class DefaultMessageController {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    sendDefaultMessage(msg) {
        const chatId = msg.chat.id;
        const markdown = MarkdownBuilder.buildDefaultMessageMD();
        const options = {
            parse_mode: "Markdown",
            disable_web_page_preview: true
        };
        this.bot.sendMessage(chatId, markdown, options);
    }
}