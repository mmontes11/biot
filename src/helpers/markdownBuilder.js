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
        markdown += `/subscribe - Subscribes this chat to notifications\n`;
        markdown += `/unsubscribe - Unsubscribes this chat from notifications\n`;
        markdown += `/mysubscriptions - Lists subscriptions of this chat\n`;
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
    static buildEventNotificationMD(notification) {
        const thing = notification.thing;
        const eventType = notification.observation.type;
        let markdown = `Something happened in \`${thing}\`:\n`;
        markdown += `_${eventType}_\n`;
        return markdown;
    }
    static buildMeasurementNotificationMD(notification) {
        const thing = notification.thing;
        const measurementType = notification.observation.type;
        const value = notification.observation.value;
        const unit = notification.observation.unit.symbol;
        let markdown = `New _${measurementType}_ measurement performed in \`${thing}\`:\n`;
        markdown += `${value}${unit}\n`;
        return markdown
    }
    static buildMeasurementChangedNotificationMD(notification) {
        const measurementType = notification.observation.type;
        const measurementValue = notification.observation.value;
        const thing = notification.thing;
        const unit = notification.observation.unit.symbol;
        const growthRate = notification.changes.growthRate;
        const growthRatePercentage = growthRate * 100;
        const changedText = MarkdownBuilder._changedText(growthRate);
        let markdown = `It seems that _${measurementType}_ is ${changedText} in \`${thing}\`:\n`;
        markdown += `*current value*: ${measurementValue}${unit}\n`;
        markdown += `*growth rate*: ${growthRatePercentage}%\n`;
        return markdown;
    }
    static buildSubscriptionsMD(subscriptions) {
        let markdown = "";
        _.forEach(subscriptions, (subscription) => {
            markdown += MarkdownBuilder._buildSubscriptionMD(subscription);
            markdown += '\n';
        });
        return markdown;
    }
    static buildSubscriptionSuccessMD(subscription) {
        let markdown = "You are already subscribed to:\n\n";
        markdown += `${MarkdownBuilder._buildSubscriptionMD(subscription)}`;
        return markdown
    }
    static buildAlreadySubscribedMD(subscription) {
        let markdown = "Success! You will now receive notifications from:\n\n";
        markdown += `${MarkdownBuilder._buildSubscriptionMD(subscription)}`;
        return markdown;
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
            markdown += `${measurements.map(m => `_${m}_`).join(', ')} \n`;
        }
        if (!_.isEmpty(events)) {
            markdown += "*events*: ";
            markdown += `${events.map(e => `_${e}_`).join(', ')} \n`;
        }
        return markdown;
    }
    static _buildStatsMD(statsElement) {
        const statsType = statsElement.data.type;
        const unit = statsElement.data.unit.symbol;
        let markdown = `*type*: _${statsType}_\n`;
        markdown += MarkdownBuilder._buildStatsElementMD('avg', statsType, statsElement.avg, unit);
        markdown += MarkdownBuilder._buildStatsElementMD('max', statsType, statsElement.max, unit);
        markdown += MarkdownBuilder._buildStatsElementMD('min', statsType, statsElement.min, unit);
        markdown += `*stdDev*: ${statsElement.stdDev}\n`;
        return markdown;
    }
    static _buildStatsElementMD(statsName, statsType, value, unit) {
        let markdown = `*${statsName}*: ${value}${unit}`;
        let emoji = EmojiHandler.emojiForStatsType(statsType, value);
        if (!_.isUndefined(emoji)) {
            markdown += ` ${emoji}\n`;
        } else {
            markdown += "\n";
        }
        return markdown;
    }
    static _changedText(growthRate) {
        const emoji = EmojiHandler.emojisForGrowthRate(growthRate);
        if (growthRate > 0) {
            return `growing ${emoji}`;
        } else if (growthRate < 0) {
            return `decreasing ${emoji}`;
        } else {
            return "not changing";
        }
    }
    static _buildSubscriptionMD(subscription) {
        let markdown = `*thing*: \`${subscription.thing}\`\n`;
        markdown += `*observationType*: _${subscription.observationType}_\n`;
        markdown += `*notificationType*: ${subscription.notificationType}\n`;
        return markdown;
    }
}