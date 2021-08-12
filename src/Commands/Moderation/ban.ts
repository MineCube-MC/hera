import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'ban',
    options: [
        {
            name: 'member',
            description: 'The member that needs to be banned',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason you want to ban the member',
            type: 'STRING',
            required: false
        }
    ],
    description: 'Bans a member from the guild.',
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('BAN_MEMBERS')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        let punishedUser = interaction.guild.members.cache.get(interaction.options.getUser("member").id);

        if(!punishedUser.kickable) return interaction.reply("I haven't the permission to ban this user. Does he have a higher role? Do I have the permission to ban him?");

        let reason = interaction.options.getString("reason");

	    try {
            if(reason) punishedUser.ban({ reason: reason });
		    if(!reason) punishedUser.ban();

            const banEmbed = new MessageEmbed()
            .setColor(client.config.colors.positive)
            .setDescription(`✅ **${punishedUser.user.tag}** has been successfully banned!\nReason: __${reason}__`);
        
            if(!reason) banEmbed.setDescription(`✅ **${punishedUser.user.tag}** has been successfully banned!\nReason: __Not specified__`);

            interaction.reply({ embeds: [ banEmbed ] });
	    } catch (error) {
		    interaction.reply("Can't kick this user, does he have a higher role? Is the server creator? Have I got the permission to kick him?");
	    }
    }
}