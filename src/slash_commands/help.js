const { Client, Message, MessageEmbed } = require('discord.js');
const config = require('../../config.json');

/**
 * @param {Client} client
 * @param {Message} message
 */
module.exports = {
    slash: "both",
    testOnly: true,
    description: 'Get a list of commands or some other infos about a command.',
    expectedArgs: "[command]",
    callback: async ({client, message, args}) => {
        const [command] = args;

        const helpEmbed = new MessageEmbed()
        .setColor(config.colors.main)
        .setAuthor(`${client.user.username} Help Menu`)
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

        if(message) helpEmbed.setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }));

        function removeDuplicates(arr) {
            return [...new Set(arr)];
        }

        function capitalise(string) {
            return string.split(' ').map(str => str.slice(0, 1).toUpperCase() + str.slice(1)).join(' ');
        }

        if(command) {
            const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));

            if (!cmd) return message.channel.send(`Invalid Command named. \`${command}\``);

		    helpEmbed.setAuthor(`${capitalise(cmd.name)} Command Help`, client.user.displayAvatarURL());
            let cmdAliases;
            if (cmd.aliases) {
                cmdAliases = `**❯ Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases'}`;
            } else {
                cmdAliases = `**❯ Aliases:** No aliases`;
            };
		    helpEmbed.setDescription([
                cmdAliases,
		    	`**❯ Description:** ${cmd.description}`,
		    	`**❯ Category:** ${cmd.category ? cmd.category : 'General'}` /*,
		    	`**» Usage:** ${cmd.usage}` */
		    ]);

            if(message) {
                message.reply(helpEmbed);
            }

            return helpEmbed;
        } else {
            helpEmbed.setDescription([
                `These are the available commands`,
                `The bot's prefix is: ${config.prefix}`,
                `Command Parameters: \`<>\` is strict & \`[]\` is optional`
            ]);

            let categories;
            if(message) {
                if (!config.owners.includes(message.author.id)) {
                    categories = removeDuplicates(client.commands.filter(cmd => cmd.category !== 'Developer Only').map(cmd => cmd.category));
                } else {
                    categories = removeDuplicates(client.commands.map(cmd => cmd.category));
                }
            } else {
                categories = removeDuplicates(client.commands.filter(cmd => cmd.category !== 'Developer Only').map(cmd => cmd.category));
            }

            for (const category of categories) {
                helpEmbed.addField(`**${capitalise(category)}**`, client.commands.filter(cmd =>
                    cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
            }

            if(message) {
                message.reply(helpEmbed);
            }

            return helpEmbed;
        }
    }
}