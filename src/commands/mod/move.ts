import { ApplicationCommandOptionType, ChannelType, GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "move",
    description: "Move members in a certain voice channel in another voice channel",
    userPermissions: ["MoveMembers"],
    options: [
        {
            name: "from",
            description: "The voice channel where members are connected now",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice],
            required: true
        },
        {
            name: "to",
            description: "The voice channel where you want to move the members",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice],
            required: true
        }
    ],
    run: async({ interaction, args }) => {
        const from = args.getChannel("from") as VoiceChannel;
        const to = args.getChannel("to") as VoiceChannel;
        let moved: GuildMember[] = [];

        if(!interaction.guild.members.me.permissions.has("MoveMembers")) return interaction.reply({
            content: `I haven't got the permission to move members`,
            ephemeral: true
        });

        from.members.forEach((member) => {
            moved.push(member);
            member.voice.setChannel(to);
        });

        return interaction.reply({
            ephemeral: true,
            embeds: [
                new ExtendedEmbed()
                .setTitle("Operation Successful")
                .setDescription(`Successfully moved members from \`${from.name}\` to \`${to.name}\``)
                .addFields([
                    {
                        name: "Moved members",
                        value: moved.map(member => `${member}`).join(", ")
                    }
                ])
            ]
        });
    }
});