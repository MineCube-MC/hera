import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'wasted',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: 'Waste someone',
    run: async(client, args, message) => {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        if(message.mentions.users.first()) avatar = message.mentions.users.first().displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.wasted(avatar);
        let attachment = new MessageAttachment(image, "wasted.png");
        return message.channel.send({ files: [attachment] });
    }
}