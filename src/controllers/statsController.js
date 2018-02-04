import _ from 'underscore';
import httpStatus from 'http-status';
import { StatsParams } from '../model/statsParams';
import { MarkdownBuilder } from '../helpers/markdownBuilder';
import { ErrorHandler } from '../helpers/errorHandler';
import commandMessages from '../util/commandMessages';
import errorMessages from '../util/errorMessages';

export class StatsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.statsParamsByChat = [];
        this.errorHandler = new ErrorHandler(telegramBot);
    }
    handleStatsCommand(msg) {
        const chatId = msg.chat.id;
        this._deleteStatsParams(chatId);
        this._selectThings(chatId);
    }
    handleCallbackQuery(callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const statsParams = this._getOrCreateStatsParams(chatId);
        const callbackQueryData = callbackQuery.data;
        const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);

        if (_.isUndefined(statsParams.thing)) {
            statsParams.setThing(callbackQueryData);
            this._selectTimePeriod(chatId, answerCallbackQuery);
        } else if (!_.isUndefined(statsParams.thing) && _.isUndefined(statsParams.timePeriod)) {
            statsParams.setTimePeriod(callbackQueryData);
            this._deleteStatsParams(chatId);
            this._showStats(chatId, statsParams, answerCallbackQuery);
        } else {
            this._deleteStatsParams(chatId);
            this._selectThings(chatId, answerCallbackQuery)
        }
    }
    _selectThings(chatId, statsCriteria, answerCallbackQuery) {
        this.iotClient.thingsService.getThings()
            .then((response) => {
                const things = _.map(response.body.things, (thing) => {
                    return {
                        text: thing.name,
                        callback_data: thing.name
                    };
                });
                const options = {
                    reply_markup: {
                        inline_keyboard: [ things ]
                    }
                };
                if (!_.isUndefined(answerCallbackQuery)) {
                    answerCallbackQuery();
                }
                this.bot.sendMessage(chatId, commandMessages.thingSelectMessage, options);
            })
            .catch((err) => {
                if (!_.isUndefined(answerCallbackQuery)) {
                    answerCallbackQuery();
                }
                this.errorHandler.handleThingsError(err, chatId);
            });
    }
    _selectTimePeriod(chatId, answerCallbackQuery) {
        this.iotClient.timePeriodsService.getSupportedTimePeriods()
            .then((response) => {
                const timePeriods = _.map(response.body.timePeriods, (timePeriod) => {
                    return {
                        text: timePeriod,
                        callback_data: timePeriod
                    }
                });
                const options = {
                    reply_markup: {
                        inline_keyboard: [ timePeriods ]
                    }
                };
                answerCallbackQuery();
                this.bot.sendMessage(chatId, commandMessages.timePeriodSelectMessage, options);
            })
            .catch((err) => {
                answerCallbackQuery();
                this.errorHandler.handleTimePeriodsError(err, chatId);
            });
    }
    _showStats(chatId, statsParams, answerCallbackQuery) {
        this.iotClient.measurementService.getStats(statsParams.toJSON())
            .then((response) => {
                const stats = response.body.stats;
                const markdown = MarkdownBuilder.buildStatsListMD(stats);
                const options = {
                    parse_mode: "Markdown",
                    disable_web_page_preview: true
                };
                answerCallbackQuery();
                this.bot.sendMessage(chatId, markdown, options);
            })
            .catch((err) => {
                answerCallbackQuery();
                this.errorHandler.handleStatsError(err, chatId);
            });
    }
    _deleteStatsParams(chatId) {
        const statsParamsIndex = _.findIndex(this.statsParamsByChat, (statsParams) => {
            return statsParams.chatId === chatId;
        });
        if (statsParamsIndex != -1) {
            this.statsParamsByChat.splice(statsParamsIndex, 1);
        }
    }
    _getOrCreateStatsParams(chatId) {
        let statsParams =  _.find(this.statsParamsByChat, (statsParams) => {
            return statsParams.chatId === chatId;
        });
        if (_.isUndefined(statsParams)) {
            statsParams = new StatsParams(chatId);
            this.statsParamsByChat.push(statsParams);
            return statsParams
        } else {
            return statsParams
        }
    }
}