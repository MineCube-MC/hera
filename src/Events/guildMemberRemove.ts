import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { moderationLogsCollection as logsCollection, partnersCollection } from '../Collections';

export const event: Event = {
    name: 'guildMemberRemove',
    run: async(client, member: GuildMember) => {
        if(member.user === client.user) {
            if(partnersCollection.get(member.guild.id)) {
                const logsChannel = client.channels.cache.find(ch => ch.id === logsCollection.get(client.config.partnership.mainGuild));
                if(!logsChannel) return;
                if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
                logsChannel.send({ embeds: [
                    new MessageEmbed()
                        .setColor(client.config.colors.negative)
                        .setTitle('Partnership broken')
                        .setDescription(
                            `**❯ Server ID:** ${member.guild.id}\n` +
                            `**❯ Server Name:**${member.guild.name}`
                        )
                ] });
            }
            return;
        }
        const logsChannel = client.channels.cache.find(ch => ch.id === logsCollection.get(member.guild.id));
        if(!logsChannel) return;
        if (!((logsChannel): logsChannel is TextChannel => logsChannel.type === 'GUILD_TEXT')(logsChannel)) return;
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