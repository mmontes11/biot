import _ from 'underscore';
import { EmojiHandler } from './emojiHandler'
import { NotificationType } from '../models/notificationType';

export class MarkdownBuilder {
    static buildDefaultMessageMD() {
        let markdown = `I'm an [Internet of Things](https://en.wikipedia.org/wiki/Internet_of_things) bot. `;
        markdown += `I can notify you about measurements and events in your things.\n\n`;
        markdown += `Available commands:\n`;
        markdown += `/things - Lists things\n`;
        markdown += `/stats - Provides measurement stats\n`;
        return markdown;
    }
    static buildThingsListMD(things) {
        let markdown = "";
        _.forEach(things, (thing) => {
            markdown += MarkdownBuilder._buildThingMD(thing);
            markdown += '\n';
        });
        return markdown;
    }
    static buildStatsListMD(statsParams, stats) {
        let markdown = `\`${statsParams.thing}\` stats by ${statsParams.timePeriod}:\n\n`;
        _.forEach(stats, (statsElement) => {
            markdown += MarkdownBuilder._buildStatsMD(statsElement);
            markdown += '\n';
        });
        return markdown;
    }
    static buildNotificationMD(notification) {
        switch (notification.type) {
            case NotificationType.valueChanged: {
                return MarkdownBuilder._buildValueChangedNotification(notification);
            }
            case NotificationType.event: {
                return MarkdownBuilder._buildEventNotification(notification);
            }
        }
    }
    static _buildThingMD(thing) {
        let markdown = `*thing*: \`${thing.name}\`\n`;
        markdown += `*ip*: ${thing.ip}\n`;
        markdown += `*location*: [Google Maps URL](${thing.googleMapsUrl})\n`;
        markdown += `*last observation*: ${thing.lastObservation}\n`;
        const measurements = thing.supportedObservationTypes.measurement;
        const events = thing.supportedObservationTypes.event;
        if (!_.isEmpty(measurements)) {
            markdown += "*measurements*: ";
            markdown += `${measurements.join(', ')} \n`;
        }
        if (!_.isEmpty(events)) {
            markdown += "*events*: ";
            markdown += `${events.join(', ')} \n`;
        }
        return markdown;
    }
    static _buildStatsMD(statsElement) {
        const statsType = statsElement.data.type;
        let markdown = `*type*: \`${statsType}\`\n`;
        markdown += MarkdownBuilder._buildStatsElementMD('avg', statsType, statsElement.avg);
        markdown += MarkdownBuilder._buildStatsElementMD('max', statsType, statsElement.max);
        markdown += MarkdownBuilder._buildStatsElementMD('min', statsType, statsElement.min);
        markdown += `*stdDev*: ${statsElement.stdDev}\n`;
        return markdown;
    }
    static _buildStatsElementMD(statsName, statsType, value) {
        let markdown = `*${statsName}*: ${value}`;
        let emoji = EmojiHandler.emojiForStatsType(statsType, value);
        if (!_.isUndefined(emoji)) {
            markdown += ` ${emoji}\n`;
        } else {
            markdown += "\n";
        }
        return markdown;
    }
    static _buildValueChangedNotification(notification) {
        const observationType = notification.observation.type;
        const observationValue = notification.observation.value;
        const thing = notification.thing;
        const unit = notification.observation.unit.symbol;
        const growthRate = notification.valueChanges.growthRate * 100;
        const valueChangedText = MarkdownBuilder._valueChangedText(notification.valueChanges.growthRate);
        let markdown = `It seems that \`${observationType}\` is ${valueChangedText} in \`${notification.thing}\`:\n`;
        markdown += `*current value*: ${observationValue}${unit}\n`;
        markdown += `*growth rate*: ${growthRate}%\n`;
        return markdown;
    }
    static _buildEventNotification(notification) {
        const thing = notification.thing;
        const observationType = notification.observation.type;
        return `Something is happening in \`${thing}\`: \`${observationType}\``;
    }
    static _valueChangedText(growthRate) {
        const emoji = EmojiHandler.emojisForGrowthRate(growthRate);
        if (growthRate > 0) {
            return `growing ${emoji}`;
        } else if (growthRate < 0) {
            return `decreasing ${emoji}`;
        } else {
            return "not changing";
        }
    }
}