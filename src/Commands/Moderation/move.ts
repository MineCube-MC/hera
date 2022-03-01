import { VoiceChannel } from "discord.js";
import { Command } from "../../Interfaces";

export const command: Command = {
    name: "move",
    description: "Move members in a certain voice channel in another voice channel",
    options: [
        {
            name: "from",
            description: "The voice channel where members are connected now",
            type: "CHANNEL",
            channelTypes: ["GUILD_VOICE"],
            required: true
        },
        {
            name: "to",
            description: "The voice channel where you want to move the members",
            type: "CHANNEL",
            channelTypes: ["GUILD_VOICE"],
            required: true
        }
    ],
    async execute(interaction) {
        if(!interaction.memberPermissions.has("MOVE_MEMBERS")) return interaction.reply({
            content: `The \`MOVE_MEMBERS\` permission is needed to execute this command!`,
            ephemeral: true
        });

        const from = interaction.options.getChannel("from") as VoiceChannel;
        const to = interaction.options.getChannel("to") as VoiceChannel;

        from.members.forEach((member) => {
            member.voice.setChannel(to);
        });

        return interaction.reply({
            content: `Successfully moved members from \`${from.name}\` to \`${to.name}\``,
            ephemeral: true
        });
    }
}