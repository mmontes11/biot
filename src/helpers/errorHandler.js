import _ from 'underscore';
import httpStatus from 'http-status';
import errorMessages from '../utils/errorMessages'

export class ErrorHandler {
    constructor(telegramBot) {
        this.bot = telegramBot;
    }
    handleThingsError(err, chatId) {
        this._handleError(err, chatId, errorMessages.noThingsAvailable, errorMessages.errorGettingThings);
    }
    handleTimePeriodsError(err, chatId) {
        this._handleError(err, chatId, errorMessages.noTimePeriodsAvailable, errorMessages.errorGettingTimePeriods)
    }
    handleStatsError(err, chatId) {
        this._handleError(err, chatId, errorMessages.noStatsAvailable, errorMessages.errorGettingStats)
    }
    handleObservationTypesError(err, chatId) {
        this._handleError(err, chatId, errorMessages.noThingsObservationTypes, errorMessages.errorGettingObservationTypes);
    }
    _handleError(err, chatId, notFoundMessage, errorMessage) {
        if (_.isEqual(err.statusCode, httpStatus.NOT_FOUND)) {
            this.bot.sendMessage(chatId, errorMessages.errorGenericNotFound);
        } else {
            this.bot.sendMessage(chatId, errorMessages.errorGeneric);
        }
    }
}