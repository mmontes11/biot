import _ from "underscore";
import { StatsParams } from "../../models/statsParams";
import { MarkdownBuilder } from "../../helpers/markdownBuilder";
import { ErrorHandler } from "../../helpers/errorHandler";
import { CallbackData, CallbackDataType } from "../../models/callbackData";
import { TelegramInlineKeyboardHelper } from "../../helpers/telegramInlineKeyboardHelper";
import messages from "../../utils/messages";

export class MeasurementStatsController {
  constructor(telegramBot, iotClient) {
    this.bot = telegramBot;
    this.iotClient = iotClient;
    this.supportedCallbackDataTypes = [CallbackDataType.selectThing, CallbackDataType.selectTimePeriod];
    this.errorHandler = new ErrorHandler(telegramBot);
    this.statsParamsByChat = [];
  }
  handleMeasurementStatsCommand(msg) {
    const chatId = msg.chat.id;
    this._start(chatId);
  }
  canHandleCallbackData(callbackData) {
    return _.contains(this.supportedCallbackDataTypes, callbackData.type);
  }
  handleCallbackQuery(callbackQuery, callbackData) {
    const chatId = callbackQuery.message.chat.id;
    const statsParams = this._getOrCreateMeasurementStatsParams(chatId);
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
          this._deleteMeasurementStatsParams(chatId);
          this._showMeasurementStats(chatId, statsParams, answerCallbackQuery);
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
    this._deleteMeasurementStatsParams(chatId);
    this._selectThings(chatId);
  }
  async _selectThings(chatId) {
    try {
      const response = await this.iotClient.thingsService.getThings();
      const inlineKeyboardButtons = _.map(response.body.things, thing => {
        const callbackData = new CallbackData(CallbackDataType.selectThing, thing.name);
        return {
          text: thing.name,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      this.bot.sendMessage(chatId, messages.thingSelectMessage, options);
    } catch (err) {
      this.errorHandler.handleThingsError(err, chatId);
    }
  }
  async _selectTimePeriod(chatId, answerCallbackQuery) {
    try {
      const response = await this.iotClient.timePeriodsService.getSupportedTimePeriods();
      const inlineKeyboardButtons = _.map(response.body.timePeriods, timePeriod => {
        const callbackData = new CallbackData(CallbackDataType.selectTimePeriod, timePeriod);
        return {
          text: timePeriod,
          callback_data: callbackData.serialize(),
        };
      });
      const options = {
        reply_markup: {
          inline_keyboard: TelegramInlineKeyboardHelper.rows(inlineKeyboardButtons),
        },
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, messages.timePeriodSelectMessage, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleTimePeriodsError(err, chatId);
    }
  }
  async _showMeasurementStats(chatId, statsParams, answerCallbackQuery) {
    try {
      const {
        body: { stats },
      } = await this.iotClient.measurementService.getStats(statsParams.toJSON());
      const markdown = MarkdownBuilder.buildMeasurementStatsListMD(statsParams, stats);
      const options = {
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      };
      answerCallbackQuery();
      this.bot.sendMessage(chatId, markdown, options);
    } catch (err) {
      answerCallbackQuery();
      this.errorHandler.handleStatsError(err, chatId);
    }
  }
  _deleteMeasurementStatsParams(chatId) {
    const statsParamsIndex = _.findIndex(this.statsParamsByChat, statsParams => statsParams.chatId === chatId);
    if (statsParamsIndex !== -1) {
      this.statsParamsByChat.splice(statsParamsIndex, 1);
    }
  }
  _getOrCreateMeasurementStatsParams(chatId) {
    let statsParams = _.find(this.statsParamsByChat, params => params.chatId === chatId);
    if (_.isUndefined(statsParams)) {
      statsParams = new StatsParams(chatId);
      this.statsParamsByChat.push(statsParams);
      return statsParams;
    }
    return statsParams;
  }
}
