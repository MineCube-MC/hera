import { Command } from '../../Interfaces';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import chalk from 'chalk';

export const command: Command = {
    name: 'help',
    type: 'both',
    category: 'General',
    description: 'Get a list of commands or some other infos about a command.',
    aliases: [''],
    usage: '[command]',
    run: async(client, args, message) => {
        const command = args[0]?.toLowerCase();

        if(!message) {
            if(command) {
                const cmd = client.commands.get(command) || client.aliases.get(command);
                if(!cmd) return console.log(`There's no command with that name.`);
                
                let cmdType;
                if(cmd.type == 'both') cmdType = 'Both';
                if(!cmd.type) cmdType = 'Both';
                if(cmd.type == 'bot') cmdType = 'Bot';
                if(cmd.type == 'console') cmdType = 'Console';

                console.log(
                    `${chalk.yellowBright(client.capitalize(cmd.name))} Command Help\n` +
                    `- Aliases: ${cmd.aliases.length ? cmd.aliases.map(alias => `\'${alias}\'`).join(' ') : 'No aliases'}\n` +
                    `- Type: ${cmdType}\n` +
				    `- Description: ${cmd.description}\n` +
				    `- Category: ${cmd.category}\n` +
                    `- Usage: ${client.config.prefix}${cmd.name} ${cmd.usage ? cmd.usage : ''}`)
            } else {
                console.log(`These are the available commands: ${client.commands.map(cmd => `\'${cmd.name}\'`).join(' ')}`);
            }
            return;
        }

        const helpEmbed = new MessageEmbed()
            .setColor((client.config.colors.main as ColorResolvable))
            .setAuthor(`${message.guild.name} Help Menu`, message.guild.iconURL({ dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();
        
        if(command) {
            const cmd = client.commands.get(command) || client.aliases.get(command);
            if(cmd.type === 'console') return message.reply(`There's no command with that name.`);
            if(!cmd) return message.reply(`There's no command with that name.`);

            helpEmbed.setAuthor(`${client.capitalize(cmd.name)} Command Help`, client.user.displayAvatarURL())
                .setDescription(
                    `**» Aliases:** ${cmd.aliases.length ? cmd.aliases.map(alias => `\`${alias}\``).join(' ') : 'No aliases'}\n` +
				    `**» Description:** ${cmd.description}\n` +
				    `**» Category:** ${cmd.category}\n` +
                    `**» Usage:** \`${client.config.prefix}${cmd.name} ${cmd.usage ? cmd.usage : ''}\``
                );
            
            return message.reply({ embeds: [helpEmbed] });
        } else {
            helpEmbed.setDescription(
                `These are the available commands for ${message.guild.name}\n` +
				`The bot's prefix is: **${client.config.prefix}**\n` +
				`Command Parameters: \`<>\` is strict & \`[]\` is optional`
            );

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
			return message.channel.send({ embeds: [helpEmbed] });
        }
    }
}