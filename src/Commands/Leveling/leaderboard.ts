import { Command } from '../../Interfaces';
import Levels from 'discord-xp';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'leaderboard',
    description: 'Shows the leaderboard of the guild',
    async execute(interaction, client) {
        const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 5);
        if (rawLeaderboard.length < 1) return interaction.reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard); 

        const lb = (await leaderboard).map(e => `**${e.position}. ${e.username}#${e.discriminator}**\nLevel: ${e.level}\nXP: ${e.xp.toString()}`);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle(`${interaction.guild.name}'s leaderboard`)
            .setColor(client.config.colors.main)
            .setDescription(`${lb.join("\n\n")}`)
            .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }));
        
        interaction.reply({ embeds: [ leaderboardEmbed ] });
    }
}