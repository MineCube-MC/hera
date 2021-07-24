import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'shutdown',
    category: 'Administration',
    aliases: ['logout', 'explode'],
    description: 'Shuts down the client and all the database connections.',
    run: async(client, message, args) => {
        message.channel.send(
            new MessageEmbed()
                .setTitle('Shutting down')
                .setColor(client.config.colors.main)
                .setDescription('The client is shutting down and the connection with the database is closing.')
                .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        ).then(client.shutdown);
    }
}