import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'jail',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: 'Send someone to jail',
    run: async(client, args, message) => {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        if(message.mentions.users.first()) avatar = message.mentions.users.first().displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.jail(avatar, true);
        let attachment = new MessageAttachment(image, "jail.png");
        return message.channel.send({ files: [attachment] });
    }
}