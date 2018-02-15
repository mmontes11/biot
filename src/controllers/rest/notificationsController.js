import httpStatus from 'http-status';
import _ from 'underscore';
import telegramBotController from '../bot/telegramBotController';
import { NotificationType , supportedNotificationTypes } from "../../models/notificationType"

const sendNotifications = async (req, res, next) => {
    const notifications = req.body.notifications;
    if (!_.isArray(notifications)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (_.isEmpty(notifications)) {
        return res.sendStatus(httpStatus.NOT_MODIFIED);
    }

    let validNotifications = [];
    let invalidNotifications = [];
    for (const notification of notifications) {
        if (_isValidNotification(notification)) {
            validNotifications.push(notification);
        } else {
            invalidNotifications.push(notification);
        }
    }

    if (_.isEmpty(validNotifications)) {
        return res.status(httpStatus.BAD_REQUEST).json({ invalidNotifications });
    } else {
        const handledNotifications = await telegramBotController.handleNotifications(validNotifications);
        if (_.isEmpty(invalidNotifications) && _.isEmpty(handledNotifications.erroredNotifications)) {
            res.status(httpStatus.OK).json({
                sentNotifications: handledNotifications.sentNotifications
            });
        } else {
            res.status(httpStatus.MULTI_STATUS).json({
                sentNotifications: handledNotifications.sentNotifications,
                erroredNotifications: handledNotifications.erroredNotifications,
                invalidNotifications
            });
        }
    }
};

const _isValidNotification = (notification) => {
    const invalidNotificationType = _.isUndefined(notification.type) || !_.contains(supportedNotificationTypes, notification.type);
    const invalidFields = _.isUndefined(notification.chatId) || _.isUndefined(notification.thing) || _.isUndefined(notification.observation);
    const invalidValueChangedNotification = _.isEqual(notification.type, NotificationType.valueChanged) && _.isUndefined(notification.valueChanges);
    return !(invalidNotificationType || invalidFields || invalidValueChangedNotification);
};

export default { sendNotifications };