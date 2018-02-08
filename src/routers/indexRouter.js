import express from 'express';
import httpStatus from 'http-status';

const router = express.Router();

router.get('/health-check', (req, res) => {
    res.sendStatus(httpStatus.OK);
});

export default router;