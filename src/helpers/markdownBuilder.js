import _ from 'underscore';
import { EmojiHandler } from './emojiHandler'

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
        let emojiHandler = new EmojiHandler(statsElement.data.type);
        let markdown = `*type*: \`${statsElement.data.type}\`\n`;
        markdown += MarkdownBuilder._buildStatsElementMD('avg', statsElement.avg, emojiHandler);
        markdown += MarkdownBuilder._buildStatsElementMD('max', statsElement.max, emojiHandler);
        markdown += MarkdownBuilder._buildStatsElementMD('min', statsElement.min, emojiHandler);
        markdown += `*stdDev*: ${statsElement.stdDev}\n`;
        return markdown;
    }
    static _buildStatsElementMD(statsName, value, emojiHandler) {
        let markdown = `*${statsName}*: ${value}`;
        let emoji = emojiHandler.emojiForValue(value);
        if (!_.isUndefined(emoji)) {
            markdown += ` ${emoji}\n`;
        } else {
            markdown += "\n";
        }
        return markdown;
    }
}