import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'restart',
    category: 'Administration',
    description: 'Restarts the client',
    run: async(client, args, interaction) => {
        if(!interaction) return client.restart();
        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: "You are not allowed to execute this command.", ephemeral: true });
        interaction.reply({ content: 'The bot is restarting', ephemeral: true }).then(() => client.restart());
    }
}