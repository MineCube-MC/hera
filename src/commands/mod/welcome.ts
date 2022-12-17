import { ApplicationCommandOptionType, ChannelType, TextChannel } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "welcome",
    description: "Enable/Disable the welcome channel with cards in your guild",
    userPermissions: ["ManageChannels"],
    options: [
        {
            name: "enable",
            description: "Enable the welcome channel",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "The channel where the welcome cards are going to be sent",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        },
        {
            name: "disable",
            description: "Disable the welcome channel",
            type: ApplicationCommandOptionType.Subcommand
        },
        {
            name: "text",
            description: "Change what's the text that's going to be sent along with the card",
            type: ApplicationCommandOptionType.Subcommand,
            options: [{
                name: "text",
                description: "The text that's going to be sent. Available placeholders: {member}, {guild}",
                type: ApplicationCommandOptionType.String,
                required: true
            }]
        }
    ],
    run: async({ interaction, args }) => {
        const query = args.getSubcommand();
        const channel = args.getChannel("channel") as TextChannel;
        const text = args.getString("text");

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
                    welcome: {
                        enabled: true,
                        channelID: channel.id,
                        text: guildData.welcome.text
                    }
                }
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle("Operation Successful")
                    .setDescription(`The welcome channel has been successfully set to ${channel}.`)
                ]
            });
        } else if(query === "disable") {
            const response = await guildSchema.findOneAndUpdate({
                serverID: interaction.guildId
            }, {
                $set: {
                    welcome: {
                        enabled: false
                    }
                }
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle("Operation Successful")
                    .setDescription(`The welcome channel has been successfully disabled.`)
                ]
            });
        } else if(query === "text") {
            const response = await guildSchema.findOneAndUpdate({
                serverID: interaction.guildId
            }, {
                $set: {
                    welcome: {
                        enabled: guildData.welcome.enabled,
                        channelID: guildData.welcome.channelID,
                        text: text
                    }
                }
            });
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle("Operation Successful")
                    .setDescription(`The welcome channel text has been successfully changed.`)
                    .addFields([{
                        name: "Text",
                        value: `\`${text}\``
                    }])
                ]
            });
        }
    }
});
