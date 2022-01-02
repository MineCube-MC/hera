import { GuildBan, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsSchema } from '../Models/moderationLogs';

export const event: Event = {
    name: 'guildBanAdd',
    run: async(client, ban: GuildBan) => {
        const modSchema = await moderationLogsSchema.findOne({ guild: ban.guild.id });
        const logsChannel = client.channels.cache.find(ch => ch.id === modSchema.get('Channel'));
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        logsChannel.send({ embeds: [
            new MessageEmbed()
                .setAuthor(ban.user.tag, ban.user.displayAvatarURL({ dynamic: true }))
                .setColor(client.config.colors.negative)
                .setTitle('Member banned')
                .setDescription(
                    `**❯ User ID:** ${ban.user.id}\n` +
                    `**❯ Reason:** ${ban.reason ? ban.reason : 'Not specified'}`
                )
                .setTimestamp()
        ] });
    }
}