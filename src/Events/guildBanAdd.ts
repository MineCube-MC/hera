import { GuildBan, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsCollection as logsCollection } from '../Collections';

export const event: Event = {
    name: 'guildBanAdd',
    run: async(client, ban: GuildBan) => {
        const logsChannel = client.channels.cache.find(ch => ch.id === logsCollection.get(ban.guild.id));
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