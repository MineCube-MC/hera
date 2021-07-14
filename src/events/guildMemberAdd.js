const { Client, MessageEmbed, GuildMember } = require('discord.js');
const config = require('../../config.json');

/**
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = (client, member) => {
    const welcomeEmbed = new MessageEmbed()
    .setColor(0x008000)
    .setAuthor(`${member.user.username} joined the server`)
    .setThumbnail(member.user.avatarURL())
    .addField('About this user', `
    **Tag:** ${member.user.tag}
    **Created at:** ${member.user.createdAt}
    **Joined at:** ${new Date().toLocaleString("en-US", { timeZone: "America/New_York", timeZoneName: "short", weekday: "short", month: "long", day: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit' })}`)
    .setFooter(client.user.username, client.user.avatarURL());
    client.channels.cache.get(config.features.joinChannelId).send(welcomeEmbed);
}