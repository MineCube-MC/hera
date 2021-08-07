import { TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'clear',
    type: 'bot',
    category: 'Moderation',
    description: 'Delete up to 100 interactions at once',
    run: async(client, args, interaction) => {
        if (!args[0]) return interaction.reply('You haven\'t given an amount of interactions which should be deleted!');
        const intArgs = parseInt(args[0]);
        if (isNaN(intArgs)) return interaction.reply("The amount parameter isn't a number!");
        if (intArgs > 100) return interaction.reply("You can't delete more than 100 interactions at once!");
        if (intArgs < 1) return interaction.reply('You have to delete at least 1 interaction!');

        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('MANAGE_MESSAGES')) return interaction.reply("You haven't the permission to execute this command!");
    
        await interaction.channel.messages.fetch({ limit: intArgs }).then(messages => {
            (<TextChannel> interaction.channel).bulkDelete(messages);
        });
    }
}