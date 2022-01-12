import { VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "activity",
    description: "A workaround to start an activity in any voice channel.",
    options: [
        {
            name: "youtube",
            description: "Generate a Watch Together activity link",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Choose the voice channel for the activity",
                    type: "CHANNEL",
                    required: true
                }
            ]
        },
        {
            name: "doodlecrew",
            description: "Generate a Doodle Crew activity link",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Choose the voice channel for the activity",
                    type: "CHANNEL",
                    required: true
                }
            ]
        }
    ],
    run: async({ interaction, client }) => {
        const channel = interaction.options.getChannel("channel") as VoiceChannel;
        if(!(channel instanceof VoiceChannel)) return interaction.followUp(`The channel must be a voice channel!`);

        const activity = interaction.options.getSubcommand();
        let activityName = "a Discord activity";

        if(activity === "youtube") activityName = "**Watch Together**";
        if(activity === "doodlecrew") activityName = "**Doodle Crew**";
        
        client.activities.createTogetherCode(channel.id, activity).then(async invite => {
            if(!invite.code) return interaction.followUp({
                content: `Due to the slow Discord API, we can't send you the invite code`,
                ephemeral: true
            });

            interaction.followUp({
                embeds: [
                    new ExtendedEmbed()
                        .setTitle("Discord Activity")
                        .setDescription(`A temporary invite link has been generated to join ${activityName} in \`${channel.name}\`.`)
                        .addField("How to join", `Just [click here](${invite.code}) and you'll be able to join both the voice channel and the activity.`)
                        .setFooter({
                            text: `Requested by ${interaction.user.username}`,
                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                        })
                ]
            })
        });
    }
});