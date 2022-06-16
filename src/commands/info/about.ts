import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { title, description, createdBy, features, credits, links } from "../../../assets/locale.json";

export default new Command({
    name: "about",
    description: "Tells more about the bot",
    run: async({ interaction, client }) => {
        const aboutEmbed = new ExtendedEmbed()
            .setTitle(`${title}`)
            .setDescription(description)
            .addField("Features", `${features.description}\n${features.commands}\n${features.funCommands}\n${features.giveawayCommands}\n${features.activityCommands}\n${features.configCommands}\n${features.musicCommands}`)
            .addField("Credits", `${credits.description}\n${credits.discordjs}\n${credits.reconlx}`)
            .addField("Links", `${links.server} | ${links.bot} | ${links.github}`)
            .setFooter({
                text: createdBy.text,
                iconURL: createdBy.icon
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
        interaction.reply({
            embeds: [aboutEmbed]
        });
    }
});