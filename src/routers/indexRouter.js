import express from 'express';
import httpStatus from 'http-status';
import authRouter from './authRouter';
import notificationsRouter from './notificationsRouter';

const router = express.Router();

router.get('/health-check', (req, res) => {
    res.sendStatus(httpStatus.OK);
});

router.use('/auth', authRouter);
router.use('/notifications', notificationsRouter);

export default router;