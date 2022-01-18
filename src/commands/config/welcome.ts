import { TextChannel } from "discord.js";
import { Command } from "../../structures/Command";
import guildSchema from "../../models/guild";

export default new Command({
    name: "welcome",
    description: "Manage the welcome channel preferences",
    userPermissions: ["MANAGE_GUILD"],
    options: [
        {
            name: "set",
            description: "Set the welcome channel to text channel of this guild",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "The text channel for the welcome messages",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                }
            ]
        },
        {
            name: "disable",
            description: "Disable the welcome messages from the bot",
            type: "SUB_COMMAND"
        }
    ],
    run: async({ interaction, client }) => {
        const command: string = interaction.options.getSubcommand();

        if(command === "set") {
            const channel: TextChannel = interaction.options.getChannel("channel") as TextChannel;

            if(!guildSchema.findOne({ id: interaction.guildId })) {
                await new guildSchema({
                    id: interaction.guildId,
                    preferences: {
                        welcomeChannel: channel.id
                    }
                }).save().then(async() => {
                    interaction.followUp({
                        content: `The channel has been set to <#${channel.id}>.`,
                        ephemeral: true
                    });
                });
            } else {
                await guildSchema.updateOne({ id: interaction.guildId }, {
                    preferences: {
                        welcomeChannel: channel.id
                    }
                }).then(async() => {
                    interaction.followUp({
                        content: `The channel has been updated to <#${channel.id}>.`,
                        ephemeral: true
                    });
                });
            }
        } else if(command === "disable") {
            if(!guildSchema.findOne({ id: interaction.guildId })) {
                await new guildSchema({
                    id: interaction.guildId
                }).save().then(async() => {
                    interaction.followUp({
                        content: `No welcome channel was set yet!`,
                        ephemeral: true
                    });
                });
            } else {
                await guildSchema.updateOne({ id: interaction.guildId }, {
                    preferences: {
                        welcomeChannel: null
                    }
                }).then(async() => {
                    interaction.followUp({
                        content: `The welcome messages have been disabled.`,
                        ephemeral: true
                    })
                })
            }
        }
    }
});