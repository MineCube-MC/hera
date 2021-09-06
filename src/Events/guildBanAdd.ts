import { GuildBan, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { guildsSchema as Schema } from '../Models/guilds';

export const event: Event = {
    name: 'guildBanAdd',
    run: async(client, ban: GuildBan) => {
        let modLogsId;
        Schema.findOne({ guild: ban.guild.id }, async(err, data) => {
            if(data) modLogsId = data.channel.logging;
        });
        const logsChannel = client.channels.cache.find(ch => ch.id === modLogsId);
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