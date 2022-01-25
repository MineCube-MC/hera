import { TextChannel } from "discord.js";
import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";

export default new Command({
    name: "welcome",
    description: "Enable/Disable the welcome channel with cards in your guild",
    userPermissions: ["MANAGE_CHANNELS"],
    options: [
        {
            name: "enable",
            description: "Enable the welcome channel",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The channel where the welcome cards are going to be sent",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                }
            ]
        },
        {
            name: "disable",
            description: "Disable the welcome channel",
            type: "SUB_COMMAND"
        },
        {
            name: "text",
            description: "Change what's the text that's going to be sent along with the card",
            type: "SUB_COMMAND",
            options: [{
                name: "text",
                description: "The text that's going to be sent. Available placeholders: {member}, {guild}",
                type: "STRING",
                required: true
            }]
        }
    ],
    run: async({ interaction, client }) => {
        const query = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel("channel") as TextChannel;
        const text = interaction.options.getString("text");

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
                    }
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
                content: `The welcome channel has been successfully enabled and set to ${channel}.`,
                ephemeral: true
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
                content: `The welcome channel has been successfully disabled.`,
                ephemeral: true
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
                content: `The welcome message has been successfully set to \`${text}\`.`,
                ephemeral: true
            });
        }
    }
});