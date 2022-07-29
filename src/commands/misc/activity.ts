import { ApplicationCommandOptionType, ChannelType, VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { commands } from '../../../assets/locale.json';

export default new Command({
    name: "activity",
    description: "A workaround to start an activity in any voice channel.",
    options: [
        {
            name: "youtube",
            description: "Generate a Watch Together activity link",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Choose the voice channel for the activity",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildVoice],
                    required: true
                }
            ]
        },
        {
            name: "doodlecrew",
            description: "Generate a Doodle Crew activity link",
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    description: "Choose the voice channel for the activity",
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildVoice],
                    required: true
                }
            ]
        }
    ],
    run: async({ client, interaction, args }) => {
        return interaction.reply("This command is temporarily disabled.");
        /* const channel = args.getChannel("channel") as VoiceChannel;
        if(!(channel instanceof VoiceChannel)) return interaction.reply(`The channel must be a voice channel!`);

        const activity = args.getSubcommand();
        let activityName = "a Discord activity";

        if(activity === "youtube") activityName = "**Watch Together**";
        if(activity === "doodlecrew") activityName = "**Doodle Crew**";
        
        client.activities.createTogetherCode(channel.id, activity).then(async invite => {
            if(!invite.code) return interaction.reply({
                content: `Due to the slow Discord API, we can't send you the invite code`,
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new ExtendedEmbed()
                        .setTitle(commands.activity.title)
                        .setDescription(commands.activity.description.replaceAll("{activityName}", activityName).replaceAll("{channelName}", channel.name))
                        .addFields([{
                            name: commands.activity.tutorial.title,
                            value: commands.activity.tutorial.description.replaceAll("{inviteCode}", invite.code)
                        }])
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL()
                        })
                ]
            })
        }); */
    }
});