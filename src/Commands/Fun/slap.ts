import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { slap } from 'ainasepics';

export const command: Command = {
    name: 'slap',
    type: 'bot',
    category: 'Fun',
    
    description: `Slap a user of your choice`,
    run: async(client, args, interaction) => {
        const mentionedPerson = interaction.options.getUser("user");

        if(mentionedPerson) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle(`${interaction.user.tag} slapped ${mentionedPerson.tag}`)
                    .setImage(slap())
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return interaction.reply('Mention a user you want to slap so hard.');
    }
}