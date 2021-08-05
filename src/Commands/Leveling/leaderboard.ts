import { Command } from '../../Interfaces';
import Levels from 'discord-xp';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'leaderboard',
    type: 'bot',
    category: 'Leveling',
    aliases: [],
    run: async(client, args, message) => {
        const rawLeaderboard = await Levels.fetchLeaderboard(message.guild.id, 5);
        if (rawLeaderboard.length < 1) return message.reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard); 

        const lb = (await leaderboard).map(e => `**${e.position}. ${e.username}#${e.discriminator}**\nLevel: ${e.level}\nXP: ${e.xp.toString()}`);

        const leaderboardEmbed = new MessageEmbed()
            .setTitle(`${message.guild.name}'s leaderboard`)
            .setColor(client.config.colors.main)
            .setDescription(`${lb.join("\n\n")}`)
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }));
        
        message.reply({ embeds: [ leaderboardEmbed ] });
    }
}