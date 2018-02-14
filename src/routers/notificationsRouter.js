import express from 'express';
import expressBasicAuth from 'express-basic-auth';
import notificationsController from '../controllers/rest/notificationsController';
import config from '../config/index';

const router = express.Router();

router
    .route('/')
        .post(expressBasicAuth({ users: config.basicAuthUsers}), notificationsController.validateReceiveNotifications, notificationsController.receiveNotifications);

export default router;