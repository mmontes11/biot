import _ from 'underscore';

export class MarkdownBuilder {
    static buildDefaultMessageMD() {
        let markdown = `I'm an [Internet of Things](https://en.wikipedia.org/wiki/Internet_of_things) bot. `;
        markdown += `I can notify you about measurements and events in your things.\n\n`;
        markdown += `Available commands:\n`;
        markdown += `/things - List things`;
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
    static buildStatsListMD(stats) {
        let markdown = "";
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
        let markdown = `*thing*: \`${statsElement.data.thing}\`\n`;
        markdown += `*type*: \`${statsElement.data.type}\`\n`;
        markdown += `*avg*: ${statsElement.avg}\n`;
        markdown += `*max*: ${statsElement.max}\n`;
        markdown += `*min*: ${statsElement.min}\n`;
        markdown += `*stdDev*: ${statsElement.stdDev}\n`;
        return markdown;
    }
}