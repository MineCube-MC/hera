import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'rainbow',
    type: 'bot',
    category: 'Fun',
    
    description: 'Make fun of someone by making his avatar all rainbow ( ͡° ͜ʖ ͡°)',
    run: async(client, args, interaction) => {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.rainbow(avatar);
        let attachment = new MessageAttachment(image, "rainbow.png");
        return interaction.reply({ files: [attachment] });
    }
}