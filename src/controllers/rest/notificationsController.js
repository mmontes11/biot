import httpStatus from 'http-status';
import _ from 'underscore';
import telegramBotController from '../bot/telegramBotController';

const validateReceiveNotifications = (req, res, next) => {
    const notifications = req.body.notifications;
    if (!_.isArray(notifications)) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    if (_.isEmpty(notifications)) {
        return res.sendStatus(httpStatus.NOT_MODIFIED);
    }
    next();
};


const receiveNotifications = (req, res) => {
    const notifications = req.body.notifications;
    telegramBotController.handleNotifications(notifications);
    res.sendStatus(httpStatus.OK);
};

export default { validateReceiveNotifications, receiveNotifications };