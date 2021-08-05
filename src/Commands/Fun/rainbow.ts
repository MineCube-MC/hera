import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'rainbow',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: 'Make fun of someone by making his avatar all rainbow ( ͡° ͜ʖ ͡°)',
    run: async(client, args, message) => {
        let avatar = message.author.displayAvatarURL({ dynamic: false, format: 'png' });
        if(message.mentions.users.first()) avatar = message.mentions.users.first().displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.rainbow(avatar);
        let attachment = new MessageAttachment(image, "rainbow.png");
        return message.channel.send({ files: [attachment] });
    }
}