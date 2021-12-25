import { Command } from '../../Interfaces';
import { GuildMember, MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'doodlecrew',
    description: 'Sends an invite to open the Doodle Crew activity',
    async execute(interaction, client) {
        let channel = (interaction.member as GuildMember).voice.channel;
        if(!channel) return interaction.reply({
            content: 'You have to be in a voice channel for this to work',
            ephemeral: true
        });

        client.activities.createTogetherCode(channel.id, 'doodlecrew').then(async invite => {
            if(!invite.code) return interaction.reply({
                content: `Due to the slow Discord API, we can't send you the invite code`,
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("Doodle Crew")
                        .setColor(client.config.colors.fun)
                        .setDescription(`Doodle Crew is a fun game where you need to draw and people need to guess your drawing to win`)
                        .setThumbnail(`https://cdn.discordapp.com/app-icons/878067389634314250/9bd4b9e21576f14f09a9284d45640a9e.webp?size=1280`)
                        .addField("Mobile devices?", `Discord still hasn't support for activities on mobile devices, and since this is a game, you can't do anything about it.`)
                        .addField("Invite link", `Just [click me](${invite.code})`)
                        .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
                ]
            });
        });
    }
}