const { Client, Message } = require('discord.js');
const ApexieEmbed = require('../utils/ApexieEmbed');
const config = require('../../config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
	const attachments = message.attachments.size ? message.attachments.map(attachment => attachment.proxyURL) : null;
	const modEmbed = new ApexieEmbed()
    .setColor(config.colors.main)
	.setAuthor(message.author.tag, client.user.displayAvatarURL({ dynamic: true }))
	.setTitle('Message Deleted')
	.setDescription([
		`**❯ Message ID:** ${message.id}`,
		`**❯ Channel:** ${message.channel}`,
		`**❯ Author:** ${message.member.displayName}`,
		`${attachments ? `**❯ Attachments:** ${attachments.join('\n')}` : ''}`
	]);
    if (message.content.length) {
		modEmbed.splitFields(`**❯ Deleted Message:** ${message.content}`);
	}

	message.guild.channels.cache.get(config.features.modChannelId).send(modEmbed);
}