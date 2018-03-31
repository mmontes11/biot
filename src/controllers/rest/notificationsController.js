import httpStatus from 'http-status';
import _ from 'underscore';
import log from '../../utils/log';
import requestValidator from '../../helpers/requestValidator';
import telegramBotController from '../bot/telegramBotController';

const receiveEventNotifications = async(req, res, next) => {
    try {
        await _sendNotifications(req, res,
                                requestValidator.isValidObservationNotification,
                                notifications => telegramBotController.handleEventNotifications(notifications));
    } catch (err) {
        log.logError(err);
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
};

const receiveMeasurementNotifications = async(req, res, next) => {
    try {
        await _sendNotifications(req, res,
                                requestValidator.isValidObservationNotification,
                                notifications => telegramBotController.handleMeasurementNotifications(notifications));
    } catch (err) {
        log.logError(err);
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
};

const receiveMeasurementChangedNotifications = async(req, res, next) => {
    try {
        await _sendNotifications(req, res,
                                requestValidator.isValidMeasurementChangedNotification,
                                notifications => telegramBotController.handleMeasurementChangedNotifications(notifications));
    } catch (err) {
        log.logError(err);
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
};

const _sendNotifications = async(req, res, isValidNotification, handleNotifications) => {
    const notifications = req.body.notifications;
    let validNotifications = [];
    let invalidNotifications = [];
    for (const notification of notifications) {
        if (isValidNotification(notification)) {
            validNotifications.push(notification);
        } else {
            invalidNotifications.push(notification);
        }
    }
    if (_.isEmpty(validNotifications)) {
        return res.status(httpStatus.BAD_REQUEST).json({ invalidNotifications });
    } else {
        const handledNotifications = await handleNotifications(notifications);
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

export default { receiveEventNotifications, receiveMeasurementNotifications, receiveMeasurementChangedNotifications };