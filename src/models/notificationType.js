const NotificationType = Object.freeze({
    valueChanged: "value-changed",
    event: "event"
});

const supportedNotificationTypes = [ NotificationType.valueChanged, NotificationType.event ];

export { NotificationType, supportedNotificationTypes };