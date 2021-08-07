import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'trigger',
    options: [
        {
            name: 'user',
            description: 'The user you want to be shown in the image',
            type: 'USER',
            required: false
        }
    ],
    description: 'Trigger someone (pretty self-explainatory, right?)',
    async execute(interaction) {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.trigger(avatar);
        let attachment = new MessageAttachment(image, "triggered.gif");
        return interaction.reply({ files: [attachment] });
    }
}