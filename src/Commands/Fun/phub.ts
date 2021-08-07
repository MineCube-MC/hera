import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'phub',
    type: 'bot',
    category: 'Fun',
    
    description: 'Generates a PHub comment',
    run: async(client, args, interaction) => {
        let username = interaction.user.username;
        let avatar = interaction.user.displayAvatarURL({ dynamic: true, format: 'png' });
        if(!args[0]) return interaction.reply('Please insert a comment.');
        let comment = args.join(" ");
        if(interaction.options.getUser("user")) {
            let shiftedArgs = args.slice(interaction.mentions.users.first.length);
            username = interaction.options.getUser("user").username;
            avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: true, format: 'png' });
            comment = shiftedArgs.join(" ");
        }
        let image = await Canvacord.phub({
            username: username,
            interaction: comment,
            image: avatar
        });
        let attachment = new MessageAttachment(image, "phub.png");
        return interaction.reply({ files: [attachment] });
    }
}