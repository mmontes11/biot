import telegramBot from './lib/telgramBot';
import iotClient from './lib/iotClient';
import { TelegramBotController } from './controllers/telegramBotController';

const telegramBotController = new TelegramBotController(telegramBot);
telegramBotController.listen();

