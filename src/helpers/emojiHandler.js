import emojiLib from 'node-emoji';

const temperaturePrefix = process.env.BIOT_TEMPERATURE_PREFIX;
const highTemperatureThreshold = parseFloat(process.env.BIOT_HIGH_TEMPERATURE_THRESHOLD);
const lowTemperatureThreshold =parseFloat(process.env.BIOT_LOW_TEMPERATURE_THRESHOLD);
const humidityPrefix = process.env.BIOT_HUMIDITY_PREFIX;
const highHumidityThreshold = parseFloat(process.env.BIOT_HIGH_HUMIDITY_THRESHOLD);
const lowHumidityThreshold = parseFloat(process.env.BIOT_LOW_HUMIDITY_THRESHOLD);
const growthRateModerateThreshold = parseFloat(process.env.BIOT_GROWTH_RATE_MODERATE_ABSOLUTE_THREESHOLD);
const growthRateHighThreshold = parseFloat(process.env.BIOT_GROWTH_RATE_HIGH_ABSOLUTE_THREESHOLD);

export class EmojiHandler {
    static emojiForStatsType(statsType, value) {
        if (statsType.startsWith(temperaturePrefix)) {
            if (value >= highTemperatureThreshold) {
                return emojiLib.get("fire");
            } else if (value <= lowTemperatureThreshold) {
                return emojiLib.get("snowflake");
            }
        } else if (statsType.startsWith(humidityPrefix)) {
            if (value >= highHumidityThreshold) {
                return emojiLib.get("droplet");
            } else if (value <= lowHumidityThreshold) {
                return emojiLib.get("cactus");
            }
        }
    }
    static emojisForGrowthRate(growthRate) {
        const emojiName = (growthRate > 0) ? "chart_with_upwards_trend" : "chart_with_downwards_trend";
        const emoji = emojiLib.get(emojiName);
        const growthRateAbsolute = Math.abs(growthRate);

        let numEmojis = 1;
        if (growthRateAbsolute >= growthRateHighThreshold) {
            numEmojis = 3;
        } else if (growthRateAbsolute >= growthRateModerateThreshold) {
            numEmojis = 2;
        }

        let emojis = "";
        for (let i = 0; i < numEmojis; i++) {
            emojis += `${emoji}`;
        }
        return emojis;
    }

}