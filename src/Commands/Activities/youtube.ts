import { Command } from '../../Interfaces';
import fetch from 'node-fetch';
import { GuildMember, MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'youtube',
    description: 'Sends an invite to open the YouTube Together activity',
    async execute(interaction, client) {
        let channel = (interaction.member as GuildMember).voice.channel;
        if(!channel) return interaction.reply({
            content: 'You have to be in a voice channel for this to work',
            ephemeral: true
        });

        await fetch(`https://discord.com/api/v8/channels/${channel.id}/invites`, {
            method: 'POST',
            body: JSON.stringify({
                max_age: 86400,
                max_uses: 0,
                target_application_id: "755600276941176913",
                target_type: 2,
                temporary: false,
                validate: null
            }),
            headers: {
                "Authorization": `Bot ${client.config.token}`,
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
        .then(invite => {
            if(!invite.code) return interaction.reply({
                content: `Due to the slow Discord API, we can't send you the invite code`,
                ephemeral: true
            });

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                        .setTitle("YouTube Together")
                        .setColor(client.config.colors.fun)
                        .setDescription(`This feature allows you to watch YouTube along with other people in a voice chat. Click the link down below to start the fun.`)
                        .setThumbnail(`https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1280px-YouTube_full-color_icon_%282017%29.svg.png`)
                        .addField("Mobile devices?", `Discord still hasn't support for activities on mobile devices, so a workaround is to share your screen with the mobile users in your voice chat.`)
                        .addField("Invite link", `Just [click me](https://discord.com/invite/${invite.code})`)
                        .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
                ]
            });
        })
    }
}