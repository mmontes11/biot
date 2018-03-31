import express from 'express';
import httpStatus from 'http-status';
import authRouter from './authRouter';
import eventRouter from './eventRouter';
import measurementRouter from './measurementRouter';
import measurementChangedRouter from './measurementChangedRouter';


const router = express.Router();

router.get('/health-check', (req, res) => {
    res.sendStatus(httpStatus.OK);
});

router.use('/auth', authRouter);
router.use('/event', eventRouter);
router.use('/measurement', measurementRouter);
router.use('/measurementChanged', measurementChangedRouter);

export default router;