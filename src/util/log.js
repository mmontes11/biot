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
        const message = msg.text;
        this.logInfo(`@${from} sent a message in ${chatType} chat ${chatId}: ${message} (message time: ${messageDate.toISOString()})`);
    }
}