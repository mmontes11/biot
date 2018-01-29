import _ from 'underscore';

export class MarkdownBuilder {
    static buildThingsListMD(things) {
        let markdown = "";
        _.forEach(things, (thing) => {
            markdown += MarkdownBuilder._buildThingMD(thing);
            markdown += '\n';
        });
        return markdown;
    }
    static _buildThingMD(thing) {
        let markdown = `\`${thing.name}\`\n`;
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
}