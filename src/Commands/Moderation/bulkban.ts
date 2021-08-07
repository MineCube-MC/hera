import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'bulkban',
    type: 'bot',
    category: 'Moderation',
    
    description: 'Bans multiple people at once',
    run: async(client, args, interaction) => {
        if(!interaction.member.permissions.has('BAN_MEMBERS')) return interaction.reply(`You don't have enough permissions to use this command`);
        if(!args[0]) return interaction.reply('You must mention at least a user to use the ban hammer on.');

        const punishedUsers = interaction.mentions.members;

        punishedUsers.forEach(user => {
            user.ban();
        });

        interaction.reply({ embeds: [
            new MessageEmbed()
                .setDescription(`✅ **${punishedUsers.size} users** have been banned from the server.`)
                .setColor(client.config.colors.positive)
        ] });
    }
}