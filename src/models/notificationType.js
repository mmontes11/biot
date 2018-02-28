const NotificationType = Object.freeze({
    event: "event",
    measurement: "measurement",
    measurementChanged: "measurementChanged"
});

const supportedNotificationTypes = [ NotificationType.event, NotificationType.measurement, NotificationType.measurementChanged ];

export { NotificationType, supportedNotificationTypes };