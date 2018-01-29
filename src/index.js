import _ from 'underscore';
import httpStatus from 'http-status';
import telegramBot from './lib/telgramBot';
import iotClient from './lib/iotClient';
import { TelegramBotController } from "./controllers/telegramBotController"

const telegramBotController = new TelegramBotController(telegramBot, iotClient);
telegramBotController.listen();