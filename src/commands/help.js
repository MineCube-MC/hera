const { Client, Message, MessageEmbed } = require('discord.js')
const config = require('../../config.json');

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 * @param {*} args 
 */
module.exports = {
    name: 'help',
    category: 'General',
    aliases: ['commands', 'cmds'],
    description: 'Get a list of commands or some other infos about a command.',

    run: async (client, message, args) => {
        const helpEmbed = new MessageEmbed()
        .setColor(config.colors.main)
        .setAuthor(`${message.guild.name} Help Menu`)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp();

        function removeDuplicates(arr) {
            return [...new Set(arr)];
        }

        function capitalise(string) {
            return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
        }

        if(args[0]) {
            const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

            if (!cmd) return message.channel.send(`Invalid Command named. \`${args[0]}\``);

		    helpEmbed.setAuthor(`${capitalise(cmd.name)} Command Help`, client.user.displayAvatarURL());
		    helpEmbed.setDescription([
		    	`**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases'}`,
		    	`**❯ Description:** ${cmd.description}`,
		    	`**❯ Category:** ${cmd.category ? cmd.category : 'General'}` /*,
		    	`**» Usage:** ${cmd.usage}` */
		    ]);

            message.channel.send(helpEmbed);
        } else {
            helpEmbed.setDescription([
                `These are the available commands for ${message.guild.name}`,
                `The bot's prefix is: ${config.prefix}`,
                `Command Parameters: \`<>\` is strict & \`[]\` is optional`
            ]);

            let categories;
            if (!config.owners.includes(message.author.id)) {
                categories = removeDuplicates(client.commands.filter(cmd => cmd.category !== 'Owner').map(cmd => cmd.category));
            } else {
                categories = removeDuplicates(client.commands.map(cmd => cmd.category));
            }

            for (const category of categories) {
                helpEmbed.addField(`**${capitalise(category)}**`, client.commands.filter(cmd =>
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
            }

            message.channel.send(helpEmbed);
        }
    }
}