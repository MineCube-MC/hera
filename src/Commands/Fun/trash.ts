import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'trash',
    type: 'bot',
    category: 'Fun',
    
    description: 'Trash someone',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.trash(avatar);
        let attachment = new MessageAttachment(image, "trash.png");
        return interaction.reply({ files: [attachment] });
    }
}