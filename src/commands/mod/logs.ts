import { TextChannel } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { createdBy } from "../../../assets/locale.json";

export default new Command({
    name: "logs",
    description: "Manage the server logs",
    userPermissions: ["ADMINISTRATOR"],
    options: [
        {
            name: "enable",
            description: "Enable the server log channel",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel you want to set as logs channel",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                }
            ]
        },
        {
            name: "disable",
            description: "Disable the server log channel",
            type: "SUB_COMMAND"
        }
    ],
    run: async({ interaction, args }) => {
        const query = args.getSubcommand();
        const channel = args.getChannel("channel") as TextChannel;

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
                    logs: {
                        enabled: false,
                        channelID: "none"
                    },
                    autoRoles: [],
                    blacklist: []
                });
                guild.save();
                guildData = await guildSchema.findOne({ serverID: interaction.guildId });
            }
        } catch (e) {
            console.error(e);
        }

        if(query === "enable") {
            const response = await guildSchema.findOneAndUpdate({
                serverID: interaction.guildId
            }, {
                $set: {
                    logs: {
                        enabled: true,
                        channelID: channel.id
                    }
                }
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle("Operation Successful")
                    .setDescription(`The log channel has been successfully set to \`${channel}\``)
                    .setFooter({
                        text: createdBy.text,
                        iconURL: createdBy.icon
                    })
                ]
            });
        } else if(query === "disable") {
            const response = await guildSchema.findOneAndUpdate({
                serverID: interaction.guildId
            }, {
                $set: {
                    logs: {
                        enabled: false
                    }
                }
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle("Operation Successful")
                    .setDescription(`The log channel has been successfully disabled.`)
                    .setFooter({
                        text: createdBy.text,
                        iconURL: createdBy.icon
                    })
                ]
            });
        }
    }
});