import { ApplicationCommandOptionType, ChannelType, TextChannel } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "logs",
    description: "Manage the server logs",
    userPermissions: ["Administrator"],
    options: [
        {
            name: "enable",
            description: "Enable the server log channel",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "The channel you want to set as logs channel",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        },
        {
            name: "disable",
            description: "Disable the server log channel",
            type: ApplicationCommandOptionType.Subcommand
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
                    tickets: {
                        enabled: false,
                        channelID: 'none',
                        categoryID: 'none'
                    },
                    leveling: {
                        enabled: true
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
                    .setDescription(`The log channel has been successfully set to ${channel}`)
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
                ]
            });
        }
    }
});