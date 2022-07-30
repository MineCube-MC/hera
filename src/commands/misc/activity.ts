import { ApplicationCommandOptionChoiceData, ApplicationCommandOptionType, ChannelType, VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { commands } from '../../../assets/locale.json';
import { DiscordActivityType, DiscordActivitiesList } from "../../typings/Activity";

let activities: ApplicationCommandOptionChoiceData[] = [];

DiscordActivitiesList.forEach(type => {
    activities.push(
        {
            name: type.toString(),
            value: type.toString()
        }
    );
});

export default new Command({
    name: "activity",
    description: "A workaround to start an activity in any voice channel.",
    options: [
        {
            name: "activity",
            description: "The activity to start",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: activities
        },
        {
            name: "channel",
            description: "Choose the voice channel for the activity",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice],
            required: true
        }
    ],
    run: async({ client, interaction, args }) => {
        const channel = args.getChannel("channel") as VoiceChannel;
        if(!(channel instanceof VoiceChannel)) return interaction.reply(`The channel must be a voice channel!`);

        const activity = (args.getString("activity") as DiscordActivityType);
        let activityName = "a Discord activity";
        
        client.createTogetherCode(channel.id, activity).then(async invite => {
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
        });
    }
});