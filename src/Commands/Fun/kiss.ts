import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';
import { kiss } from 'ainasepics';

export const command: Command = {
    name: 'kiss',
    type: 'bot',
    category: 'Fun',
    
    description: `Kiss a user of your choice`,
    run: async(client, args, interaction) => {
        const mentionedPerson = interaction.options.getUser("user");

        if(mentionedPerson) {
            interaction.reply({ embeds: [
                new MessageEmbed()
                    .setTitle(`${interaction.user.tag} kissed ${mentionedPerson.tag}`)
                    .setImage(kiss())
                    .setColor(client.config.colors.fun)
                    .setTimestamp()
            ] });
        } else return interaction.reply('Mention a user you want to kiss.');
    }
}