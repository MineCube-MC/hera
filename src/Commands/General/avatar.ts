import { Command } from "../../Interfaces";

export const command: Command = {
    name: 'avatar',
    description: 'Sends the avatar image of someone else, even of yourself',
    options: [
        {
            name: 'user',
            description: 'The user from you want to get the avatar from',
            type: 'USER',
            required: false
        }
    ],
    async execute(interaction, client) {
        const user = interaction.options.getUser('user');

        if(user) {
            interaction.reply({ content: user.displayAvatarURL({ dynamic: true }) });
        } else interaction.reply({ content: interaction.user.displayAvatarURL({ dynamic: true }) });
    }
}