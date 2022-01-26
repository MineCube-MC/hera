import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";

export default new Command({
    name: "autoroles",
    description: "Manage the roles added on to a new member in this guild",
    userPermissions: ["MANAGE_ROLES"],
    options: [
        {
            name: "add",
            description: "Add an auto role",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "role",
                    description: "The role you want to add as an auto role",
                    type: "ROLE",
                    required: true
                }
            ]
        },
        {
            name: "remove",
            description: "Remove an auto role",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "role",
                    description: "The role you want to remove from the auto roles",
                    type: "ROLE",
                    required: true
                }
            ]
        }
    ],
    run: async({ interaction, client }) => {
        const query = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role");

        let guildData;
        try {
            guildData = await guildSchema.findOne({ serverID: interaction.guildId });
            if(!guildData) {
                let guild = await guildSchema.create({
                    serverID: interaction.guildId,
                    welcome: {
                        enabled: false,
                        channelID: "none",
                        text: ":wave: Hello {member}, welcome to {guild}!"
                    },
                    autoRoles: []
                });
                guild.save();
                guildData = await guildSchema.findOne({ serverID: interaction.guildId });
            }
        } catch (e) {
            console.error(e);
        }

        if(query === "add") {
            if((guildData.autoRoles as string[]).includes(role.id)) return interaction.reply({
                content: `The **${role.name}** has already been added as an auto role.`,
                ephemeral: true
            });

            const response = await guildSchema.findOneAndUpdate({ serverID: interaction.guildId }, {
                $push: {
                    autoRoles: role.id
                }
            });
            return interaction.reply({
                content: `The **${role.name}** has been added as an autorole. Be sure that the auto role is higher than my role so I can add it to new members.`,
                ephemeral: true
            });
        } else if(query === "remove") {
            if(!(guildData.autoRoles as string[]).includes(role.id)) return interaction.reply({
                content: `The **${role.name}** role isn't an auto role in this guild.`,
                ephemeral: true
            });

            const response = await guildSchema.findOneAndUpdate({ serverID: interaction.guildId }, {
                $pull: {
                    autoRoles: role.id
                }
            });
            return interaction.reply({
                content: `The **${role.name}** role has been removed from the auto roles.`,
                ephemeral: true
            });
        }
    }
});