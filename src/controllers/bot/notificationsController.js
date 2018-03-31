import Promise from 'bluebird';
import _ from 'underscore';
import log from '../../utils/log';
import { MarkdownBuilder } from '../../helpers/markdownBuilder';

export class NotificationsController {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleEventNotifications(notifications) {
        return this._handleNotifications(notifications, notification => this._handleEventNotification(notification));
    }
    handleMeasurementNotifications(notifications) {
        return this._handleNotifications(notifications, notification => this._handleMeasurementNotification(notification));
    }
    handleMeasurementChangedNotifications(notifications) {
        return this._handleNotifications(notifications, notification => this._handleMeasurementChangedNotification(notification));
    }
    async _handleNotifications(notifications, handleNotification) {
        log.logReceivedNotifications(notifications);
        const sendMessagePromises = _.map(notifications, (notification) => {
            return handleNotification(notification).reflect();
        });
        let sentNotifications = [];
        let erroredNotifications = [];
        try {
            await Promise.all(sendMessagePromises).each((inspection, index) => {
                if (inspection.isFulfilled()) {
                    sentNotifications.push(inspection.value());
                } else {
                    erroredNotifications.push(notifications[index]);
                }
            });
            return {
                sentNotifications,
                erroredNotifications
            }
        } catch (err) {
            throw err;
        }
    }
    _handleEventNotification(notification) {
        return this._handleNotification(notification, MarkdownBuilder.buildEventNotificationMD);
    }
    _handleMeasurementNotification(notification) {
        return this._handleNotification(notification, MarkdownBuilder.buildMeasurementNotificationMD);
    }
    _handleMeasurementChangedNotification(notification) {
        return this._handleNotification(notification, MarkdownBuilder.buildMeasurementChangedNotificationMD);
    }
    _handleNotification(notification, buildMD) {
        return new Promise((resolve, reject) => {
            const options = {
                parse_mode: "Markdown"
            };
            const markdown = buildMD(notification);
            this.bot.sendMessage(notification.chatId, markdown, options)
                .then((msg) => {
                    log.logMessage(msg);
                    resolve(notification);
                })
                .catch((err) => {
                    log.logError(err);
                    reject(err);
                })
        });
    }
}