import { ColorResolvable, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { guildsSchema as Schema } from '../Models/guilds';

export const event: Event = {
    name: 'guildMemberAdd',
    run: async(client, member: GuildMember) => {
        let welcomeId;
        Schema.findOne({ guild: member.guild.id }, async(err, data) => {
            if(data) welcomeId = data.channels.welcome;
        });
        const welcomeChannel = client.channels.cache.find(ch => ch.id === welcomeId);
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