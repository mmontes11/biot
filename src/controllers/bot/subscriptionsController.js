import _ from 'underscore';
import { SubscriptionParams } from '../../models/subscriptionParams';
import { NotificationType, supportedNotificationTypes } from '../../models/notificationType';
import { CallbackData, CallbackDataType, supportedCallbackDataTypes } from "../../models/callbackData"
import commandMessages from '../../utils/commandMessages';

export class SubscriptionsController {
    constructor(telegramBot, iotClient) {
        this.bot = telegramBot;
        this.iotClient = iotClient;
        this.supportedCallbackDataTypes = [ CallbackDataType.selectNotificationType ];
        this.subscriptionParamsByChat = [];
    }
    handleSubscribeCommand(msg) {
        const chatId = msg.chat.id;
        this._startSubscribing(chatId);
    }
    canHandleCallbackData(callbackData) {
        return _.contains(this.supportedCallbackDataTypes, callbackData.type);
    }
    handleCallbackQuery(callbackQuery, callbackData) {

    }
    _startSubscribing(chatId) {
        this._deleteSubscriptionParams(chatId);
        this._selectNotificationType(chatId);
    }
    _selectNotificationType(chatId) {
        const notificationTypes = _.map(supportedNotificationTypes, (notificationType) => {
            const callbackData = new CallbackData(CallbackDataType.selectNotificationType, notificationType);
            return {
                text: notificationType,
                callback_data: callbackData.serialize()
            }
        });
        const notificationTypesRows = _.map(notificationTypes, (notificationType) => {
            return [notificationType];
        });
        const options = {
            reply_markup: {
                inline_keyboard: notificationTypesRows
            }
        };
        this.bot.sendMessage(chatId, commandMessages.notificationTypeSelectMessage, options)
    }
    _deleteSubscriptionParams(chatId) {
        const subscriptionParamsIndex = _.findIndex(this.subscriptionParamsByChat, (subscriptionParams) => {
            return subscriptionParams.chatId = chatId;
        });
        if (subscriptionParamsIndex !== -1) {
            this.subscriptionParamsByChat.splice(subscriptionParamsIndex, 1);
        }
    }
    _getOrCreateSubscriptionParams(chatId) {
        let subscriptionParams = _.find(this.subscriptionParamsByChat, (subscriptionParams) => {
            return subscriptionParams.chatId = chatId;
        });
        if (_.isUndefined(subscriptionParams)) {
            subscriptionParams = new SubscriptionParams(chatId);
            this.subscriptionParamsByChat.push(subscriptionParams);
            return subscriptionParams;
        } else {
            return subscriptionParams;
        }
    }
}