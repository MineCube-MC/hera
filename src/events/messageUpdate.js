const { Client, Message } = require('discord.js');
const ApexieEmbed = require('../utils/ApexieEmbed');
const { Util: { escapeMarkdown } } = require('discord.js');
const { diffWordsWithSpace } = require('diff');
const config = require('../../config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */
module.exports = async (client, old, message) => {
    if (!message.guild || old.content === message.content || message.author.bot) return;

	const modEmbed = new ApexieEmbed()
	.setColor('BLUE')
	.setAuthor(old.author.tag, client.user.displayAvatarURL({ dynamic: true }))
	.setTitle('Message Updated')
	.setDescription([
		`**❯ Message ID:** ${old.id}`,
		`**❯ Channel:** ${old.channel}`,
		`**❯ Author:** ${old.author.tag} (${old.author.id})`
	])
	.setURL(old.url)
	.splitFields(diffWordsWithSpace(escapeMarkdown(old.content), escapeMarkdown(message.content))
		.map(result => result.added ? `**${result.value}**` : result.removed ? `~~${result.value}~~` : result.value)
		.join(' '));

	message.guild.channels.cache.get(config.features.modChannelId).send(modEmbed);
}