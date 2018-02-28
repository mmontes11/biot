import Promise from 'bluebird';
import _ from 'underscore';
import log from '../../utils/log';
import { MarkdownBuilder } from '../../helpers/markdownBuilder';
import {NotificationType} from "../../models/notificationType";

export class NotificationsController {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    async handleNotifications(notifications) {
        log.logReceivedNotifications(notifications);

        const sendMessagePromises = _.map(notifications, (notification) => {
            return this._sendNotificationMessage(notification).reflect();
        });
        let sentNotifications = [];
        let erroredNotifications = [];

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
    }
    _sendNotificationMessage(notification) {
        return new Promise((resolve, reject) => {
            const options = {
                parse_mode: "Markdown"
            };
            let markdown;
            switch (notification.type) {
                case NotificationType.event: {
                    markdown = MarkdownBuilder.buildEventNotificationMD(notification);
                    break;
                }
                case NotificationType.measurement: {
                    markdown = MarkdownBuilder.buildMeasurementNotificationMD(notification);
                    break;
                }
                case NotificationType.measurementChanged: {
                    markdown = MarkdownBuilder.buildMeasurementChangedNotificationMD(notification);
                    break;
                }
            }
            this.bot.sendMessage(notification.chatId, markdown, options)
                .then((msg) => {
                    log.logMessage(msg);
                    resolve(notification);
                })
                .catch((err) => {
                    log.logError(err);
                    reject(notification);
                })
        });
    }
}