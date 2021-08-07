import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'wanted',
    type: 'bot',
    category: 'Fun',
    
    description: 'Sign somebody as wanted.',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.wanted(avatar);
        let attachment = new MessageAttachment(image, "wanted.png");
        return interaction.reply({ files: [attachment] });
    }
}