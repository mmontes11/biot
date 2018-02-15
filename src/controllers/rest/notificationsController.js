import httpStatus from 'http-status';
import _ from 'underscore';
import telegramBotController from '../bot/telegramBotController';
import { NotificationType , supportedNotificationTypes } from "../../models/notificationType"

const sendNotifications = (req, res, next) => {
    const notifications = req.body.notifications;
    if (!_.isArray(notifications)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (_.isEmpty(notifications)) {
        return res.sendStatus(httpStatus.NOT_MODIFIED);
    }

    let validNotifications = [];
    let invalidNotifications = [];
    _.forEach(notifications, (notification) => {
        if (_isValidNotification(notification)) {
            validNotifications.push(notification);
        } else {
            invalidNotifications.push(notification);
        }
    });

    if (_.isEmpty(validNotifications)) {
        return res.status(httpStatus.BAD_REQUEST).json({ invalidNotifications });
    } else {
        if (_.isEmpty(invalidNotifications)) {
            res.status(httpStatus.OK).json({ sentNotifications: validNotifications });
        } else {
            res.status(httpStatus.MULTI_STATUS).json({ sentNotifications: validNotifications, invalidNotifications});
        }
        telegramBotController.handleNotifications(validNotifications);
    }
};

const _isValidNotification = (notification) => {
    const invalidNotificationType = _.isUndefined(notification.type) || !_.contains(supportedNotificationTypes, notification.type);
    const invalidFields = _.isUndefined(notification.chatId) || _.isUndefined(notification.thing) || _.isUndefined(notification.observation);
    const invalidValueChangedNotification = _.isEqual(notification.type, NotificationType.valueChanged) && _.isUndefined(notification.valueChanges);
    return !(invalidNotificationType || invalidFields || invalidValueChangedNotification);
};

export default { sendNotifications };