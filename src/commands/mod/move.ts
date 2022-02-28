import { GuildMember, VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { createdBy } from "../../../assets/locale.json";

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
    run: async({ interaction, args }) => {
        const from = args.getChannel("from") as VoiceChannel;
        const to = args.getChannel("to") as VoiceChannel;
        let moved: GuildMember[];

        if(!interaction.guild.me.permissions.has("MOVE_MEMBERS")) return interaction.reply({
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
                .addField("Moved members", moved.map(member => `${member}`).join(", "))
                .setFooter({
                    text: createdBy.text,
                    iconURL: createdBy.icon
                })
            ]
        });
    }
});