import _ from 'underscore';
import httpStatus from 'http-status';
import { StatsParams } from '../../models/statsParams';
import { MarkdownBuilder } from '../../helpers/markdownBuilder';
import { ErrorHandler } from '../../helpers/errorHandler';
import { CallbackData, CallbackDataType } from "../../models/callbackData"
import commandMessages from '../../utils/commandMessages';
import errorMessages from '../../utils/errorMessages';

export class StatsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.statsParamsByChat = [];
        this.supportedCallbackDataTypes = [ CallbackDataType.selectThing, CallbackDataType.selectTimePeriod ];
        this.errorHandler = new ErrorHandler(telegramBot);
    }
    handleStatsCommand(msg) {
        const chatId = msg.chat.id;
        this._start(chatId);
    }
    canHandleCallbackData(callbackData) {
        return _.contains(this.supportedCallbackDataTypes, callbackData.type);
    }
    handleCallbackQuery(callbackQuery, callbackData) {
        const chatId = callbackQuery.message.chat.id;
        const statsParams = this._getOrCreateStatsParams(chatId);
        const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);
        const reset = () => {
            answerCallbackQuery();
            this._start(chatId);
        };

        switch (callbackData.type) {
            case CallbackDataType.selectThing: {
                if (_.isUndefined(statsParams.thing)) {
                    statsParams.setThing(callbackData.data);
                    this._selectTimePeriod(chatId, answerCallbackQuery);
                } else {
                    reset();
                }
                break;
            }
            case CallbackDataType.selectTimePeriod: {
                if (!_.isUndefined(statsParams.thing) && _.isUndefined(statsParams.timePeriod)) {
                    statsParams.setTimePeriod(callbackData.data);
                    this._deleteStatsParams(chatId);
                    this._showStats(chatId, statsParams, answerCallbackQuery);
                } else {
                    reset();
                }
                break;
            }
            default: {
                reset();
            }
        }
    }
    _start(chatId) {
        this._deleteStatsParams(chatId);
        this._selectThings(chatId);
    }
    async _selectThings(chatId, statsCriteria, answerCallbackQuery) {
        try {
            const response = await this.iotClient.thingsService.getThings();
            const things = _.map(response.body.things, (thing) => {
                const callbackData = new CallbackData(CallbackDataType.selectThing, thing.name);
                return {
                    text: thing.name,
                    callback_data: callbackData.serialize()
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
        } catch (err) {
            if (!_.isUndefined(answerCallbackQuery)) {
                answerCallbackQuery();
            }
            this.errorHandler.handleThingsError(err, chatId);
        }
    }
    async _selectTimePeriod(chatId, answerCallbackQuery) {
        try {
            const response = await this.iotClient.timePeriodsService.getSupportedTimePeriods();
            const timePeriods = _.map(response.body.timePeriods, (timePeriod) => {
                const callbackData = new CallbackData(CallbackDataType.selectTimePeriod, timePeriod);
                return {
                    text: timePeriod,
                    callback_data: callbackData.serialize()
                }
            });
            const options = {
                reply_markup: {
                    inline_keyboard: [ timePeriods ]
                }
            };
            answerCallbackQuery();
            this.bot.sendMessage(chatId, commandMessages.timePeriodSelectMessage, options);
        } catch (err) {
            answerCallbackQuery();
            this.errorHandler.handleTimePeriodsError(err, chatId);
        }
    }
    async _showStats(chatId, statsParams, answerCallbackQuery) {
        try {
            const response = await this.iotClient.measurementService.getStats(statsParams.toJSON());
            const stats = response.body.stats;
            const markdown = MarkdownBuilder.buildStatsListMD(statsParams, stats);
            const options = {
                parse_mode: "Markdown",
                disable_web_page_preview: true
            };
            answerCallbackQuery();
            this.bot.sendMessage(chatId, markdown, options);
        } catch (err) {
            answerCallbackQuery();
            this.errorHandler.handleStatsError(err, chatId);
        }
    }
    _deleteStatsParams(chatId) {
        const statsParamsIndex = _.findIndex(this.statsParamsByChat, (statsParams) => {
            return statsParams.chatId === chatId;
        });
        if (statsParamsIndex !== -1) {
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