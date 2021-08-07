import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'jail',
    type: 'bot',
    category: 'Fun',
    description: 'Send someone to jail',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.jail(avatar, true);
        let attachment = new MessageAttachment(image, "jail.png");
        return interaction.reply({ files: [attachment] });
    }
}