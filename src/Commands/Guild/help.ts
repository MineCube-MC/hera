import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'help',
    category: 'General',
    description: 'Get a list of commands or some other infos about a command.',
    aliases: [''],
    usage: '[command]',
    run: async(client, message, args) => {
        const command = args[0]?.toLowerCase();

        const helpEmbed = new MessageEmbed()
            .setColor(client.config.colors.main)
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        
        if(command) {
            const cmd = client.commands.get(command) || client.aliases.get(command);
            if(!cmd) return message.reply(`There's no command with that name.`);

            helpEmbed.setAuthor(`${client.capitalize(cmd.name)} Command Help`, client.user.displayAvatarURL())
                .setDescription([
                    `**» Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases'}`,
				    `**» Description:** ${cmd.description}`,
				    `**» Category:** ${cmd.category}`,
                    `**» Usage:** \`${client.config.prefix}${cmd.name} ${cmd.usage ? cmd.usage : ''}\``
                ]);
            
            return message.reply(helpEmbed);
        } else {
            helpEmbed.setDescription([
                `These are the available commands for ${message.guild.name}`,
				`The bot's prefix is: **${client.config.prefix}**`,
				`Command Parameters: \`<>\` is strict & \`[]\` is optional`
            ]);

            let categories;

            if(message) {
                if (!client.config.owners.includes(message.author.id)) {
                    categories = client.removeDuplicates(client.commands.filter(cmd => cmd.category !== 'Administration').map(cmd => cmd.category));
                } else {
                    categories = client.removeDuplicates(client.commands.map(cmd => cmd.category));
                }
            } else {
                categories = client.removeDuplicates(client.commands.filter(cmd => cmd.category !== 'Administration').map(cmd => cmd.category));
            }

            for (const category of categories) {
				helpEmbed.addField(`**${client.capitalize(category)}**`, client.commands.filter(cmd =>
					cmd.category === category).map(cmd => `\`${cmd.name}\``).join(' '));
			}
			return message.channel.send(helpEmbed);
        }
    }
}