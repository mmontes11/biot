import express from 'express';
import expressJwt from 'express-jwt';
import notificationsController from '../controllers/rest/notificationsController';
import config from '../config/index';

const router = express.Router();

router
    .route('/')
        .post(expressJwt({ secret: config.biotJwtSecret }), notificationsController.sendNotifications);

export default router;