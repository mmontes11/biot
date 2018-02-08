import express from 'express';
import httpStatus from 'http-status';
import telegramBotController from "../controllers/telegramBotController";


const router = express.Router();

router.get('/health-check', (req, res) => {
    res.sendStatus(httpStatus.OK);
    telegramBotController.bot.sendMessage(565598, "MESSAGE FROM REST")
});

export default router;