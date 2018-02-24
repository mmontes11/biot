export default {
    env: 'development',
    nodePort: 9090,
    biotBasicAuthUsers: {
        admin: 'admin'
    },
    biotTelegramToken: process.env.BIOT_TELEGRAM_TOKEN,
    biotTelegramWhiteListJson: JSON.parse(process.env.BIOT_USERS_WHITELIST_JSON),
    biotTemperaturePrefix: 'temperature',
    biotHighTemperatureThreshold: 25,
    biotLowTemperatureThreshold: 5,
    biotHumidityPrefix: 'humidity',
    biotHighHumidityThreshold: 90,
    biotLowHumidityThreshold: 30,
    biotGrowthRateModerateAbsoluteThreshold: 0.4,
    biotGrowthRateHighAbsoluteThreshold: 0.6,
    biotDebug: true,
    iotServerHost: 'http://localhost:9000',
    iotServerUsername: 'admin',
    iotServerPassword: 'aA12345678&'
};