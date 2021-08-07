import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'trigger',
    type: 'bot',
    category: 'Fun',
    
    description: 'Trigger someone (pretty self-explainatory, right?)',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.trigger(avatar);
        let attachment = new MessageAttachment(image, "triggered.gif");
        return interaction.reply({ files: [attachment] });
    }
}