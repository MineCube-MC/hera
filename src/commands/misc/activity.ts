import { VoiceChannel } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "activity",
    description: "Generate an invite link to start any Discord activity",
    options: [
        {
            name: "channel",
            description: "Choose the voice channel for the activity",
            type: "CHANNEL",
            required: true
        },
        {
            name: "activity",
            description: "Choose the activity you want to start",
            type: "SUB_COMMAND_GROUP",
            options: [
                {
                    name: "youtube",
                    description: "Generate a YouTube Together activity link",
                    type: "SUB_COMMAND"
                },
                {
                    name: "doodlecrew",
                    description: "Generate a Doodle Crew activity link",
                    type: "SUB_COMMAND"
                }
            ]
        }
    ],
    run: async({ interaction, client }) => {
        const channel = interaction.options.getChannel("channel") as VoiceChannel;
        if(!(channel instanceof VoiceChannel)) return interaction.followUp(`The channel must be a voice channel!`);

        const activity = interaction.options.getSubcommandGroup(true);
        
        client.activities.createTogetherCode(channel.id, activity).then(async invite => {
            if(!invite.code) return interaction.followUp({
                content: `Due to the slow Discord API, we can't send you the invite code`,
                ephemeral: true
            });

            interaction.followUp({
                embeds: [
                    new ExtendedEmbed()
                        .setTitle("Discord Activity")
                        .setDescription(`A temporary invite link has been generated to join a Discord activity in a voice channel. The voice channel the activity started is \`${channel.name}\`.`)
                        .addField("How to join", `Just [click here](${invite.code})`)
                        .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
                ]
            })
        });
    }
})