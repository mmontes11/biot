import log from '../../utils/log';

export class NotificationsController {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleNotifications(notifications) {
        log.logInfo("Received notifications");
        log.logInfo(JSON.stringify(notifications));
    }
}