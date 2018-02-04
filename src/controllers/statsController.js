import commandMessages from '../util/commandMessages';
import _ from 'underscore';
import { StatsCriteriaID, StatsCriteria } from '../model/statsCriteria';
import { StatsParams } from '../model/statsParams';
import { MarkdownBuilder } from '../helpers/markdownBuilder';

export class StatsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.availableStatsCriteria = [ StatsCriteria.addressStatsCriteria(), StatsCriteria.thingStatsCriteria() ];
        this.statsParamsByChat = [];
    }
    handleStatsCommand(msg) {
        const chatId = msg.chat.id;
        this._deleteStatsParamsIfNeeded(chatId);

        this._showStatsCriteria(chatId);
    }
    handleCallbackQuery(callbackQuery) {
        const chatId = callbackQuery.message.chat.id;
        const statsParams = this._getOrCreateStatsParams(chatId);
        const callbackQueryData = callbackQuery.data;
        const answerCallbackQuery = () => this.bot.answerCallbackQuery(callbackQuery.id);

        if (_.isUndefined(statsParams.statsCriteria)){
            statsParams.setStatsCriteria(callbackQueryData);

            this._selectStatsCriteria(chatId, callbackQueryData, answerCallbackQuery);

        } else if (_.isUndefined(statsParams.thing)) {
            statsParams.setThing(callbackQueryData);

            this._selectStatsTimePeriod(chatId, answerCallbackQuery);

        } else if (_.isUndefined(statsParams.timePeriod)) {
            statsParams.setTimePeriod(callbackQueryData);

            this._showStats(chatId, statsParams, answerCallbackQuery);
        } else {
            answerCallbackQuery();
            this._showStatsCriteria(chatId)
        }
    }
    _showStatsCriteria(chatId) {
        const inlineKeyboards = _.map(this.availableStatsCriteria, (availableStatsCriteria) => {
            return {
                text: availableStatsCriteria.name,
                callback_data: availableStatsCriteria.id
            };
        });
        const options = {
            reply_markup: {
                inline_keyboard: [ inlineKeyboards ]
            }
        };
        this.bot.sendMessage(chatId, commandMessages.statsByMessage, options);
    }
    _deleteStatsParamsIfNeeded(chatId) {
        const statsParamsIndex = _.findIndex(this.statsParamsByChat, (statsParams) => {
            return statsParams.chatId === chatId;
        });
        if (statsParamsIndex != -1) {
            this.statsParamsByChat.splice(statsParamsIndex, 1);
        }
    }
    _getOrCreateStatsParams(chatId) {
        let statsParams =  _.find(this.statsParamsByChat, { chatId });

        if (_.isUndefined(statsParams)) {
            statsParams = new StatsParams(chatId);
            this.statsParamsByChat.push(statsParams);

            return statsParams
        } else {
            return statsParams
        }
    }
    _selectStatsCriteria(chatId, statsCriteria, answerCallbackQuery) {
        switch (statsCriteria) {
            case StatsCriteriaID.address: {
                answerCallbackQuery();
                this.bot.sendMessage(chatId, commandMessages.addressTypeMessage);
                break;
            }
            case StatsCriteriaID.thing: {
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
                        answerCallbackQuery();
                        this.bot.sendMessage(chatId, commandMessages.thingSelectMessage, options);
                    })
                    .catch((err) => {
                        answerCallbackQuery();
                        throw err;
                    });
                break;
            }
        }
    }
    _selectStatsTimePeriod(chatId, answerCallbackQuery) {
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
                throw err;
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
                throw err;
            });
    }
}