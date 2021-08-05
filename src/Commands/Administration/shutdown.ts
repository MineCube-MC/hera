import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'shutdown',
    category: 'Administration',
    aliases: ['logout', 'explode', 'stop'],
    description: 'Shuts down the client and all the database connections.',
    run: async(client, args, message) => {
        if(!message) return client.shutdown();

        if (!client.config.owners.includes(message.author.id)) return message.reply("You are not allowed to execute this command.");
        message.channel.send({ embeds: [
            new MessageEmbed()
                .setTitle('Shutting down')
                .setColor(client.config.colors.admin)
                .setDescription('The client is shutting down and the connection with the database is closing.')
                .setFooter(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        ] }).then(client.shutdown);
    }
}