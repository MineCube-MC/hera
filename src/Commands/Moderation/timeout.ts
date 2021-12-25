import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'timeout',
    options: [
        {
            name: 'member',
            description: 'The member that needs to be timed out',
            type: 'USER',
            required: true
        },
        {
            name: 'seconds',
            description: 'The amount of time in seconds you want to timeout the member',
            type: 'INTEGER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason why the member needs to be timed out',
            type: 'STRING',
            required: false
        }
    ],
    description: 'Times out a member from the guild.',
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('MUTE_MEMBERS')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        let punishedUser = interaction.guild.members.cache.get(interaction.options.getUser("member").id);

        if(!punishedUser.kickable) return interaction.reply("I haven't the permission to time out this user. Does he have a higher role? Do I have the permission to time out him?");

        let seconds = interaction.options.getInteger("seconds") * 1000;

	    try {
		    if(!interaction.options.getString("reason")) {
                punishedUser.timeout(seconds);
            } else {
                punishedUser.timeout(seconds, interaction.options.getString("reason"));
            }

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor(client.config.colors.positive)
                    .setDescription(`✅ **${punishedUser.user.tag}** has been successfully timed out for ${interaction.options.getInteger("seconds")} seconds!`)
                ]
            });
	    } catch (error) {
		    interaction.reply("Can't time out this user, does he have a higher role? Is he/she the server creator? Have I got the permission to time out him?");
	    }
    }
}