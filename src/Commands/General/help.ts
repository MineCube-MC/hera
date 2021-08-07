import { Command } from '../../Interfaces';
import { ColorResolvable, MessageEmbed } from 'discord.js';
import chalk from 'chalk';

export const command: Command = {
    name: 'help',
    type: 'both',
    category: 'General',
    description: 'Get a list of commands or some other infos about a command.',
    usage: '[command]',
    run: async(client, args, interaction) => {
        let command;
        if(interaction) command = interaction.options.getString("command", false);

        if(!interaction) {
            let command = args[0]?.toLowerCase();
            if(command) {
                const cmd = client.commands.get(command);
                if(!cmd) return console.log(`There's no command with that name.`);
                
                let cmdType;
                if(cmd.type == 'both') cmdType = 'Both';
                if(!cmd.type) cmdType = 'Both';
                if(cmd.type == 'bot') cmdType = 'Bot';
                if(cmd.type == 'console') cmdType = 'Console';

                console.log(
                    `${chalk.yellowBright(client.capitalize(cmd.name))} Command Help\n` +
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
            .setAuthor(`${interaction.guild.name} Help Menu`, interaction.guild.iconURL({ dynamic: true }))
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter(`Requested by ${interaction.member.user.username}`, interaction.member.user.avatar)
            .setTimestamp();
        
        if(command) {
            const cmd = client.commands.get(command);
            if(cmd.type === 'console') return interaction.reply(`There's no command with that name.`);
            if(!cmd) return interaction.reply(`There's no command with that name.`);

            helpEmbed.setAuthor(`${client.capitalize(cmd.name)} Command Help`, client.user.displayAvatarURL())
                .setDescription(
				    `**» Description:** ${cmd.description}\n` +
				    `**» Category:** ${cmd.category}\n` +
                    `**» Usage:** \`${client.config.prefix}${cmd.name} ${cmd.usage ? cmd.usage : ''}\``
                );
            
            return interaction.reply({ embeds: [helpEmbed] });
        } else {
            helpEmbed.setDescription(
                `These are the available commands for ${interaction.guild.name}\n` +
				`Command Parameters: \`<>\` is strict & \`[]\` is optional`
            );

            let categories;

            if(interaction) {
                if (!client.config.owners.includes(interaction.member.user.id)) {
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
			return interaction.reply({ embeds: [helpEmbed] });
        }
    }
}