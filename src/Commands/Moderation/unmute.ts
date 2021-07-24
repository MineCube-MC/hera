import { MessageEmbed } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'unmute',
    category: 'Moderation',
    aliases: [],
    description: 'Unmutes a muted user from the guild',
    usage: '<@user>',
    run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"]) || !message.guild.owner) return message.reply("You haven't the permission to use this command!");
        if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.reply("I don't have permission to manage roles!");
        let toUnmute = message.mentions.members.first();
        if(!toUnmute) return message.reply("Supply a user to be unmuted");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
        toUnmute.roles.remove(muteRole.id).then(() => {
            toUnmute.send(
                new MessageEmbed()
                    .setTitle(message.guild.name)
                    .setColor(client.config.colors.main)
                    .setDescription(`You got unmuted from **${message.guild.name}**`)
            );
            message.channel.send(
                new MessageEmbed()
                    .setColor('#0099ff')
                    .setDescription(`✅ **${toUnmute.user.tag}** has been successfully unmuted!`)
            );
        })
    }
}