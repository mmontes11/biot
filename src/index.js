import _ from 'underscore';
import httpStatus from 'http-status';
import express from './lib/express';
import { Server } from 'http';
import telegramBotController from "./controllers/telegramBotController";

import config from './config/index';
import log from './utils/log';

const server = new Server(express);

server.on('error', (err) => {
    log.logError(`Error in NodeJS server on port ${config.nodePort}:`);
    log.logError(err);
});
server.on('close', () => {
    log.logInfo(`Stopped NodeJS server on port ${config.nodePort}`);
});

process.on('SIGINT', () => {
    server.close();
});

server.listen(config.nodePort, (err) => {
    if (_.isUndefined(err) || _.isNull(err)) {
        log.logInfo(`NodeJS server started on port ${config.nodePort}`);
        telegramBotController.listen();
    } else {
        log.logError(err);
    }
});