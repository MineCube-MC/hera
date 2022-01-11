import { MessageAttachment, PresenceStatus } from "discord.js";
import { Command } from "../../structures/Command";
import Levels from 'discord-xp';
import Canvacord from "canvacord";

export default new Command({
    name: "rank",
    description: "Check your level and XP in this guild",
    run: async({ interaction }) => {
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
            .setProgressBar('BLURPLE', 'COLOR')
            .setUsername(interaction.user.username)
            .setDiscriminator(interaction.user.discriminator);
        rank.build({ "fontX": "Manrope", "fontY": "Manrope" })
            .then(data => {
                const attachment = new MessageAttachment(data, `rankCard.png`);
                interaction.followUp({ files: [attachment] });
            });
    }
});