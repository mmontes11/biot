import express from 'express';
import httpStatus from 'http-status';
import notificationsRouter from './notificationsRouter';

const router = express.Router();

router.get('/health-check', (req, res) => {
    res.sendStatus(httpStatus.OK);
});

router.use('/notifications', notificationsRouter);

export default router;