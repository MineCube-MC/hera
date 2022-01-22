import { VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";

export default new Command({
    name: "move",
    description: "Move members in a certain voice channel in another voice channel",
    userPermissions: ["MOVE_MEMBERS"],
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
    run: async({ interaction, client }) => {
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
});