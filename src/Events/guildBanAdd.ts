import { ColorResolvable, Guild, MessageEmbed, TextChannel, User } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsCollection as logsCollection } from '../Collections';

export const event: Event = {
    name: 'guildBanAdd',
    run: async(client, guild: Guild, user: User) => {
        function fetchUserBan() {
            let reason = guild.bans.fetch(user.id).then(ban => ban.reason.toString());
            if(!reason) return 'Not specified';
            return reason;
        }

        const logsChannel = client.channels.cache.find(ch => ch.id === logsCollection.get(guild.id));
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
        logsChannel.send({ embeds: [
            new MessageEmbed()
                .setAuthor(user.tag, user.displayAvatarURL({ dynamic: true }))
                .setColor((client.config.colors.main as ColorResolvable))
                .setTitle('Member banned')
                .setDescription(
                    `**❯ User ID:** ${user.id}\n` +
                    `**❯ Reason:** ${fetchUserBan()}`
                )
        ] });
    }
}