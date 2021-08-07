import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'trash',
    options: [
        {
            name: 'user',
            description: 'The user you want to be shown in the image',
            type: 'USER',
            required: false
        }
    ],
    description: 'Trash someone',
    async execute(interaction) {
        let avatar = interaction.user.displayAvatarURL({ dynamic: false, format: 'png' });
        if(interaction.options.getUser("user")) avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: false, format: 'png' });
        let image = await Canvacord.trash(avatar);
        let attachment = new MessageAttachment(image, "trash.png");
        return interaction.reply({ files: [attachment] });
    }
}