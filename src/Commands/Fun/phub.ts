import { Command } from '../../Interfaces';
import { Canvacord } from 'canvacord';
import { MessageAttachment } from 'discord.js';

export const command: Command = {
    name: 'phub',
    description: 'Generates a PHub comment',
    options: [
        {
            name: 'comment',
            description: 'The comment you want to be shown in the image',
            type: 'STRING',
            required: true
        },
        {
            name: 'user',
            description: 'The user you want to be shown in the image',
            type: 'USER',
            required: false
        }
    ],
    async execute(interaction) {
        let username = interaction.user.username;
        let avatar = interaction.user.displayAvatarURL({ dynamic: true, format: 'png' });
        if(interaction.options.getUser("user")) {
            username = interaction.options.getUser("user").username;
            avatar = interaction.options.getUser("user").displayAvatarURL({ dynamic: true, format: 'png' });
        }
        let image = await Canvacord.phub({
            username: username,
            message: interaction.options.getString('comment'),
            image: avatar
        });
        let attachment = new MessageAttachment(image, "phub.png");
        interaction.reply({ files: [attachment] });
    }
}