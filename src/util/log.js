import winston from '../lib/winston';
import _ from 'underscore';

export class Log {
    constructor(debug) {
        this.debug = debug;
    }
    logInfo(message) {
        if (this.debug) {
            winston.info(message);
        }
    }
    logError(message) {
        if (this.debug) {
            winston.error(message);
        }
    }
    logMessage(msg) {
        const messageDate = new Date(msg.date * 1000);
        const from = msg.from.username;
        const chatType = msg.chat.type;
        const chatId = msg.chat.id;
        const data = msg.data;
        this.logInfo(`@${from} sent a message in ${chatType} chat ${chatId}: ${data} (message time: ${messageDate.toISOString()})`);
    }
    logCallbackQuery(callbackQuery) {
        const messageDate = new Date(callbackQuery.message.date * 1000);
        const from = callbackQuery.from.username;
        const chatType = callbackQuery.message.chat.type;
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;
        this.logInfo(`@${from} replied to a query in ${chatType} chat ${chatId}: ${data} (reply time: ${messageDate.toISOString()})`);
    }
}