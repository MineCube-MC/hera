import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';

import { guildsSchema } from '../Models/guilds';

export const event: Event = {
    name: 'guildMemberRemove',
    run: async(client, member: GuildMember) => {
        let channelFind;
        let modLogsId;
        guildsSchema.findOne({ guild: member.guild.id }, async(err, data) => {
            if(data) modLogsId = data.channels.logging;
        });
        const logsChannel = client.channels.cache.find(ch => ch.id === modLogsId);
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        
        const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_KICK',
        });
        // Since there's only 1 audit log entry in this collection, grab the first one
        const kickLog = fetchedLogs.entries.first();
    
        // Perform a coherence check to make sure that there's *something*
        if (!kickLog) return console.log(`${member.user.tag} left the guild, most likely of their own will.`);
    
        // Now grab the user object of the person who kicked the member
        // Also grab the target of this action to double-check things
        const { executor, target } = kickLog;
    
        // Update the output with a bit more information
        // Also run a check to make sure that the log returned was for the same kicked member
        if ((target as GuildMember).id === member.id) {
            logsChannel.send({ embeds: [
                new MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                    .setColor(client.config.colors.negative)
                    .setTitle('Member kicked')
                    .setDescription(
                        `**❯ User ID:** ${member.user.id}\n` +
                        `**❯ Kicked by:** ${executor.tag}`
                    )
                    .setTimestamp()
            ] });
        } else {
            logsChannel.send({ embeds: [
                new MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL({ dynamic: true }))
                    .setColor(client.config.colors.negative)
                    .setTitle('Member kicked')
                    .setDescription(
                        `**❯ User ID:** ${member.user.id}`
                    )
                    .setTimestamp()
            ] });
        }
    }
}