import { ColorResolvable, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { welcomeChannelCollection as welcomeCollection } from '../Collections';

export const event: Event = {
    name: 'guildMemberAdd',
    run: async(client, member: GuildMember) => {
        const welcomeChannel = client.channels.cache.find(ch => ch.id === welcomeCollection.get(member.guild.id));
        if(!welcomeChannel) return;
        if (!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'GUILD_TEXT')(welcomeChannel)) return;
        welcomeChannel.send({ embeds: [
            new MessageEmbed()
                .setAuthor(`${member.user.username} joined the server`)
                .setColor((client.config.colors.positive as ColorResolvable))
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
                .setDescription(
                    `**» Tag:** ${member.user.tag}\n` +
                    `**» Created at:** ${member.user.createdAt}\n` +
                    `**» Joined at:** ${member.joinedAt}`
                )
                .setFooter(member.guild.name, member.guild.iconURL({ dynamic: true }))
        ] });
    }
}