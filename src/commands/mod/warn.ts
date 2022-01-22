import { GuildMember } from "discord.js";
import profileSchema from "../../models/profileSchema";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "warn",
    description: "Warn a member and check his warnings",
    userPermissions: ["KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_MESSAGES"],
    options: [
        {
            name: "add",
            description: "Add a warning to a member",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "The member you want to add a warn.",
                    type: "USER",
                    required: true
                },
                {
                    name: "reason",
                    description: "The reason why you warned the member",
                    type: "STRING",
                    required: false
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a warning from a member",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "The member you want to remove the warn.",
                    type: "USER",
                    required: true
                }
            ]
        },
        {
            name: "number",
            description: "Check how many warning did a member get",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "member",
                    description: "The member you want to get the number of warnings.",
                    type: "USER",
                    required: true
                }
            ]
        }
    ],
    run: async({ interaction, client }) => {
        const query = interaction.options.getSubcommand();
        const member = interaction.options.getMember("member") as GuildMember;
        let reason = " ";
        if(interaction.options.getString("reason")) {
            reason = ` for **${interaction.options.getString("reason")}**`;
        };

        let profileData;
        try {
            profileData = await profileSchema.findOne({ userID: member.id });
            if(!profileData) {
                let profile = await profileSchema.create({
                    userID: member.id,
                    serverID: interaction.guildId,
                    warnings: 0
                });
                profile.save();
                profileData = await profileSchema.findOne({ userID: member.id });
            }
        } catch (e) {
            console.error(e);
        }

        if(query === "add") {
            const response = await profileSchema.findOneAndUpdate({
                userID: member.id
            }, {
                $inc: {
                    warnings: 1
                }
            });
            interaction.channel.send({ embeds: [
                new ExtendedEmbed()
                .setDescription(`You have been warned${reason} by ${interaction.member}.`)
            ], content: `${member}` });
            return interaction.reply({
                content: `Successfully warned ${member}${reason}.`,
                ephemeral: true
            });
        } else if(query === "remove") {
            if(profileData.warnings === 0) return interaction.reply({
                content: `${member} hasn't received a warning yet.`,
                ephemeral: true
            });
            const response = await profileSchema.findOneAndUpdate({
                userID: member.id
            }, {
                $inc: {
                    warnings: -1
                }
            });
            interaction.channel.send({ embeds: [
                new ExtendedEmbed()
                .setDescription(`You have been removed a warning by ${interaction.member}.`)
            ], content: `${member}` });
            return interaction.reply({
                content: `Successfully removed warning from ${member}.`,
                ephemeral: true
            });
        } else if(query === "number") {
            return interaction.reply(`${member} got **${profileData.warnings}** warnings.`);
        }
    }
});