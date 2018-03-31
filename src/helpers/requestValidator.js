import _ from 'underscore';

const isValidObservationNotification = (observationNotification) => {
    return !_.isUndefined(observationNotification) && !_.isUndefined(observationNotification.topic) &&
            !_.isUndefined(observationNotification.chatId) && !_.isUndefined(observationNotification.observation);
};

const isValidMeasurementChangedNotification = (measurementChangedNotification) => {
    return isValidObservationNotification(measurementChangedNotification) &&
            !_.isUndefined(measurementChangedNotification.changes);
};

export default { isValidObservationNotification, isValidMeasurementChangedNotification };