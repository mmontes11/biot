import _ from 'underscore';

const isValidObservationNotification = (observationNotification) => {
    return !_.isUndefined(observationNotification) && !_.isUndefined(observationNotification.topic) &&
            !_.isUndefined(observationNotification.chatId) && !_.isUndefined(observationNotification.observation);
};

const isValidMeasurementChangeNotification = (measurementChangeNotification) => {
    return !_.isUndefined(measurementChangeNotification) && !_.isUndefined(measurementChangeNotification.topic) &&
        !_.isUndefined(measurementChangeNotification.chatId) && _isValidMeasurementChange(measurementChangeNotification.measurementChange);
};

const _isValidMeasurementChange = (measurementChange) => {
    return !_.isUndefined(measurementChange.observation) && !_.isUndefined(measurementChange.growthRate);
};

export default { isValidObservationNotification, isValidMeasurementChangeNotification };