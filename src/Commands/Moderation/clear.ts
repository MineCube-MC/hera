import { TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'clear',
    options: [
        {
            name: 'amount',
            description: 'The amount of messages to delete',
            type: 'INTEGER',
            required: true
        }
    ],
    description: 'Delete up to 100 interactions at once',
    async execute(interaction) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('MANAGE_MESSAGES')) return interaction.reply("You haven't the permission to execute this command!");

        const intArgs = interaction.options.getInteger("amount");
        if (isNaN(intArgs)) return interaction.reply({ content: "The amount parameter isn't a number!", ephemeral: true });
        if (intArgs > 100) return interaction.reply({ content: "You can't delete more than 100 messages at once!", ephemeral: true });
        if (intArgs < 1) return interaction.reply({ content: "You have to delete at least 1 message!", ephemeral: true });
    
        await interaction.channel.messages.fetch({ limit: intArgs }).then(messages => {
            (<TextChannel> interaction.channel).bulkDelete(messages);
        }).then(() => {
            interaction.reply({ content: `The messages have been successfully deleted.`, ephemeral: true });
        });
    }
}