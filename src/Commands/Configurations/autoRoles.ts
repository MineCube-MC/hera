import { Command } from "../../Interfaces";
import { autoRolesSchema as Schema } from "../../Models/autoRoles";
import { autoRolesCollection as Collection } from '../../Collections';

export const command: Command = {
    name: "autoroles",
    description: "Manage the roles that every new member gets in the guild",
    options: [
        {
            name: 'add',
            description: 'Add a new auto role',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role you want to add to the list',
                    type: 'ROLE',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove an existing auto role from the list',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'role',
                    description: 'The role you want to remove from the list',
                    type: 'ROLE',
                    required: true
                }
            ]
        }
    ],
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const query = interaction.options.getSubcommand(true);

        const role = interaction.options.getRole("role");
        const roleId = role.id;

        if(query === "add") {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    if((data.AutoRoles as string[]).includes(roleId)) return interaction.reply({ content: 'The role is already added into the list.', ephemeral: true });

                    (data.AutoRoles as string[]).push(roleId);
                    data.save();
                    Collection.get(interaction.guild.id).push(roleId);
                } else {
                    new Schema({
                        Guild: interaction.guild.id,
                        AutoRoles: [ roleId ]
                    }).save();
                    Collection.set(interaction.guild.id, [ roleId ]);
                }
                interaction.reply({ content: `The role \`${role.name}\` has been added into the list.`, ephemeral: true });
            });
        } else if(query === "remove") {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.reply({ content: `There isn't any data to delete`, ephemeral: true });

                if(!(data.AutoRoles as string[]).includes(roleId)) return interaction.reply({ content: `The role doesn't exist in the list.`, ephemeral: true });

                const filtered = (data.AutoRoles as string[]).filter((target) => target !== roleId);

                await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, {
                    Guild: interaction.guild.id,
                    AutoRoles: filtered
                });
                Collection.get(interaction.guild.id).filter((target) => target !== roleId);

                interaction.reply({ content: `The role \`${role.name}\` has been removed from the list.`, ephemeral: true });
            });
        }
    }
}