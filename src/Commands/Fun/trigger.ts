import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'trigger',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: 'Trigger someone (pretty self-explainatory, right?)',
    run: async(client, args, message) => {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        if(message.mentions.users.first()) avatar = message.mentions.users.first().displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.trigger(avatar);
        let attachment = new MessageAttachment(image, "triggered.gif");
        return message.channel.send({ files: [attachment] });
    }
}