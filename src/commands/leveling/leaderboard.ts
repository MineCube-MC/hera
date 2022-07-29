import { Command } from "../../structures/Command";
import Levels from 'discord-xp';
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "leaderboard",
    description: "Shows the leaderboard of the guild",
    run: async({ interaction, client }) => {

        const rawLeaderboard = await Levels.fetchLeaderboard(interaction.guild.id, 5);
        if (rawLeaderboard.length < 1) return interaction.reply("Nobody's in leaderboard yet.");

        const leaderboard = Levels.computeLeaderboard(client, rawLeaderboard); 

        const lb = (await leaderboard).map(e => `**${e.position}. ${e.username}#${e.discriminator}**\nLevel: ${e.level}\nXP: ${e.xp.toString()}`);

        const leaderboardEmbed = new ExtendedEmbed()
            .setTitle(`${interaction.guild.name}'s leaderboard`)
            .setDescription(`${lb.join("\n\n")}`)
            .setThumbnail(interaction.guild.iconURL())
            .setFooter({
                text: `Requested by ${interaction.user.tag}`,
                iconURL: interaction.user.displayAvatarURL()
            });
        
        interaction.reply({ embeds: [ leaderboardEmbed ] });
    }
});