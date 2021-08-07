import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'shutdown',
    category: 'Administration',
    description: 'Shuts down the client and all the database connections.',
    run: async(client, args, interaction) => {
        if(!interaction) return client.shutdown();

        if (!client.config.owners.includes(interaction.user.id)) return interaction.reply({ content: "You are not allowed to execute this command.", ephemeral: true });
        interaction.reply({ embeds: [
            new MessageEmbed()
                .setTitle('Shutting down')
                .setColor(client.config.colors.admin)
                .setDescription('The client is shutting down and the connection with the database is closing.')
                .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        ], ephemeral: true }).then(client.shutdown);
    }
}