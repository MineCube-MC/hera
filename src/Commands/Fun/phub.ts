import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'phub',
    type: 'bot',
    category: 'Fun',
    aliases: [],
    description: 'Generates a PHub comment',
    run: async(client, args, message) => {
        let username = message.author.username;
        let avatar = message.author.displayAvatarURL({ dynamic: true, format: 'png' });
        if(!args[0]) return message.reply('Please insert a comment.');
        let comment = args.join(" ");
        if(message.mentions.users.first()) {
            let shiftedArgs = args.slice(message.mentions.users.first.length);
            username = message.mentions.users.first().username;
            avatar = message.mentions.users.first().displayAvatarURL({ dynamic: true, format: 'png' });
            comment = shiftedArgs.join(" ");
        }
        let image = await Canvacord.phub({
            username: username,
            message: comment,
            image: avatar
        });
        let attachment = new MessageAttachment(image, "phub.png");
        return message.channel.send({ files: [attachment] });
    }
}