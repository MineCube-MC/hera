import { ColorResolvable, GuildMember, MessageActionRow, MessageButton, MessageEmbed, Util } from 'discord.js';
import { Command } from '../../Interfaces';
import { rolesSchema as Schema } from '../../Models/roles';

export const command: Command = {
    name: 'rolebuttons',
    description: 'Manage the server role buttons',
    options: [
        {
            name: 'create',
            description: 'Create a new role button in your current text channel',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'description',
                    description: 'The description of the embed',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'role',
                    description: 'The role that needs to be added to the users that click the button',
                    type: 'ROLE',
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji for the button',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'title',
                    description: 'The title of the embed',
                    type: 'STRING',
                    required: false
                },
                {
                    name: 'color',
                    description: 'The color of the embed (needs to be in HEX format)',
                    type: 'STRING',
                    required: false
                }
            ]
        },
        {
            name: 'delete',
            description: `Delete an existing role button (the message with the role button needs to be deleted manually)`,
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role that needs to be removed',
                    type: 'ROLE',
                    required: true
                }
            ]
        }
    ],
    async execute(interaction, client) {
        if(!(interaction.member as GuildMember).permissions.has("ADMINISTRATOR")) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const action = interaction.options.getSubcommand();

        function isValidColor(str) {
            return str.match(/^#[a-f0-9]{6}$/i) !== null;
        }

        if(action === "create") {
            const description = interaction.options.getString("description");
            const role = interaction.guild.roles.cache.get(interaction.options.getRole("role").id);
            const emoji = interaction.options.getString("emoji");
            const title = interaction.options.getString("title");
            const color = (interaction.options.getString("color") as ColorResolvable);

            const buttonEmbed = new MessageEmbed()
                .setDescription(description)
                .setColor('RANDOM')
                .setFooter(interaction.guild.name, interaction.guild.iconURL({ dynamic: true }));
            
            if(color) {
                if(isValidColor(color)) {
                    buttonEmbed.setColor(color);
                } else return interaction.reply({
                    content: `The color isn't in a valid HEX format. A valid HEX format color should be like this: \`#60f20c\``,
                    ephemeral: true
                });
            }
            if(title) buttonEmbed.setTitle(title);

            const roleButton = new MessageButton()
                .setLabel(role.name)
                .setStyle('PRIMARY')
                .setCustomId(role.id);
            
            if(emoji) {
                if(Util.parseEmoji(emoji)) {
                    roleButton.setEmoji(emoji);
                } else return interaction.reply({
                    content: `The emoji doesn't use a valid format. A valid Discord format emoji should be like this: \`:joy:\``,
                    ephemeral: true
                });
            }
            
            interaction.channel.send({ embeds: [buttonEmbed], components: [
                new MessageActionRow()
                    .addComponents(roleButton)
            ] });

            Schema.findOne({ Role: roleButton.customId }, async(err, data) => {
                new Schema({
                    Role: roleButton.customId,
                    Users: []
                }).save();
            });

            interaction.reply({ content: `The role button has been created in the current text channel.`, ephemeral: true });
        } else if(action === "delete") {
            const role = interaction.guild.roles.cache.get(interaction.options.getRole("role").id);

            Schema.findOne({ Role: role.id }, async(err, data) => {
                if(!data) return interaction.reply({ content: `This role isn't registered for a role button` });
                
                await Schema.deleteOne({ Role: role.id }, () => {
                    interaction.reply({ content: `The role **${role.name}** is not used for a role button anymore. Delete the message that contains the role button.`, ephemeral: true });
                });
            });
        }
    }
}