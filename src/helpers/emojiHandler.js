import emoji from 'node-emoji';

const temperaturePrefix = process.env.BIOT_TEMPERATURE_PREFIX;
const highTemperatureThreshold = process.env.BIOT_HIGH_TEMPERATURE_THRESHOLD;
const lowTemperatureThreshold = process.env.BIOT_LOW_TEMPERATURE_THRESHOLD;
const humidityPrefix = process.env.BIOT_HUMIDITY_PREFIX;
const highHumidityThreshold = process.env.BIOT_HIGH_HUMIDITY_THRESHOLD;
const lowHumidityThreshold = process.env.BIOT_LOW_HUMIDITY_THRESHOLD;

export class EmojiHandler {
    constructor(statsType) {
        this.statsType = statsType;
    }
    emojiForValue(value) {
        if (this.statsType.startsWith(temperaturePrefix)) {
            if (value >= highTemperatureThreshold) {
                return emoji.get("fire");
            } else if (value <= lowTemperatureThreshold) {
                return emoji.get("snowflake");
            }
        } else if (this.statsType.startsWith(humidityPrefix)) {
            if (value >= highHumidityThreshold) {
                return emoji.get("droplet");
            } else if (value <= lowHumidityThreshold) {
                return emoji.get("cactus");
            }
        }
    }
}