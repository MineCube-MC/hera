import { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: "You have used a non existent command",
                ephemeral: true
            });

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    }
    // Listening to buttons
    if (interaction.isButton()) {
        // Listening to button roles
        if(interaction.customId.includes("role")) {
            const roleID = interaction.customId.replace(/[^0-9]/g, '');
            const member = interaction.member as GuildMember;

            if(interaction.guild.roles.cache.find(role => role.id === roleID)) {
                const role = interaction.guild.roles.cache.get(roleID);
                if(!interaction.guild.me.permissions.has("MANAGE_ROLES")) return interaction.reply({
                    content: `I'm missing the permission to manage roles in this guild. Contact the server administrator.`,
                    ephemeral: true
                });
                if(role.position >= interaction.guild.me.roles.highest.position) return interaction.reply({
                    content: `I can't assign/remove you this role because my highest role is below this role. Contact the server administrator.`,
                    ephemeral: true
                });
                if(member.roles.cache.some(role => role.id === roleID)) {
                    member.roles.remove(role);
                    return interaction.reply({
                        content: `You've been removed the **${role.name}** role.`,
                        ephemeral: true
                    });
                } else {
                    member.roles.add(role);
                    return interaction.reply({
                        content: `You've been added the **${role.name}** role.`,
                        ephemeral: true
                    });
                }
            } else {
                return interaction.reply({
                    content: `This role doesn't exist, try contacting the server administrator.`,
                    ephemeral: true
                });
            }
        }
    }
});
