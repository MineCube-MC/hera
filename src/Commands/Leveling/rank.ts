import { Command } from '../../Interfaces';
import Levels from 'discord-xp';
import Canvacord from 'canvacord';
import { MessageAttachment, PresenceStatus } from 'discord.js';
import { Configuration } from '../../Dashboard/Modules/Configuration';

export const command: Command = {
    name: 'rank',
    description: 'See your current ranking on the server',
    async execute(interaction, client) {
        if(await Configuration.getRanking(interaction.guild) == false) return interaction.reply(`The ranking system of this bot in this server is disabled by the server administrator.`);

        const user = await Levels.fetch(interaction.user.id, interaction.guild.id);

        let neededXp = Levels.xpFor(user.level + 1);
        if(typeof neededXp != 'number') {
            neededXp = Levels.xpFor(1);
            return interaction.reply('You didn\'t even type a message here.');
        }

        const turnToCanvacordStatus = (s: PresenceStatus): "online"|"idle"|"dnd"|"offline"|"streaming" => s === "invisible" ? "offline" : s;

        const rank = new Canvacord.Rank()
            .setAvatar(interaction.user.displayAvatarURL({ dynamic: false, format: 'png' }))
            .setCurrentXP(user.xp)
            .setRequiredXP(neededXp)
            .setLevel(user.level)
            .setStatus(turnToCanvacordStatus(interaction.guild.members.cache.get(interaction.user.id).presence.status), true)
            .setProgressBar(client.config.colors.main.toString(), 'COLOR')
            .setUsername(interaction.user.username)
            .setDiscriminator(interaction.user.discriminator);
        rank.build({ "fontX": "Manrope", "fontY": "Manrope" })
            .then(data => {
                const attachment = new MessageAttachment(data, `rankCard.png`);
                interaction.reply({ files: [attachment] });
            });
    }
}