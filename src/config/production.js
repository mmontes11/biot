export default {
    env: process.env.NODE_ENV,
    nodePort: process.env.NODE_PORT,
    biotBasicAuthUsers: {
        [process.env.BIOT_BASIC_AUTH_USER]: process.env.BIOT_BASIC_AUTH_PASSWORD
    },
    biotJwtSecret: process.env.BIOT_JWT_SECRET,
    biotTelegramToken: process.env.BIOT_TELEGRAM_TOKEN,
    biotTelegramWhiteListJson: JSON.parse(process.env.BIOT_USERS_WHITELIST_JSON),
    biotTemperaturePrefix: process.env.BIOT_TEMPERATURE_PREFIX,
    biotHighTemperatureThreshold: parseFloat(process.env.BIOT_HIGH_TEMPERATURE_THRESHOLD),
    biotLowTemperatureThreshold: parseFloat(process.env.BIOT_LOW_TEMPERATURE_THRESHOLD),
    biotHumidityPrefix: process.env.BIOT_HUMIDITY_PREFIX,
    biotHighHumidityThreshold: parseFloat(process.env.BIOT_HIGH_HUMIDITY_THRESHOLD),
    biotLowHumidityThreshold: parseFloat(process.env. BIOT_LOW_HUMIDITY_THRESHOLD),
    biotGrowthRateModerateAbsoluteThreshold: parseFloat(process.env.BIOT_GROWTH_RATE_MODERATE_ABSOLUTE_THREESHOLD),
    biotGrowthRateHighAbsoluteThreshold: parseFloat(process.env.BIOT_GROWTH_RATE_HIGH_ABSOLUTE_THREESHOLD),
    biotDebug: process.env.IOT_DEBUG,
    iotServerHost: process.env.IOT_BACKEND_HOST,
    iotServerBasicAuthUsername: process.env.IOT_BACKEND_BASIC_AUTH_USERNAME,
    iotServerBasicAuthPassword: process.env.IOT_BACKEND_BASIC_AUTH_PASSWORD,
    iotServerUsername: process.env.IOT_BACKEND_USERNAME,
    iotServerPassword: process.env.IOT_BACKEND_PASSWORD
};