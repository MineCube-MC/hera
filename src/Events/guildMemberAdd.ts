import { ColorResolvable, GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { autoRolesSchema } from '../Models/autoRoles';
import { welcomeChannelSchema } from '../Models/welcomeChannel';

export const event: Event = {
    name: 'guildMemberAdd',
    run: async(client, member: GuildMember) => {
        const autoRoles = await autoRolesSchema.findOne({ guild: member.guild.id }).get('AutoRoles').clone();
        if(autoRoles) {
            autoRoles.forEach((roleId) => {
                const role = member.guild.roles.cache.get(roleId);
                member.roles.add(role);
            });
        }
        const welcomeSchema = await welcomeChannelSchema.findOne({ guild: member.guild.id }).clone();
        const welcomeChannel = client.channels.cache.find(ch => ch.id === welcomeSchema.get('Channel'));
        if(welcomeChannel) {
            if(((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'GUILD_TEXT')(welcomeChannel)) {
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
    }
}