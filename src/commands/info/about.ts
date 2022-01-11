import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { title, description, createdBy, features, credits, links } from "../../../assets/locale.json";

export default new Command({
    name: "about",
    description: "Tells more about the bot",
    run: async({ interaction, client }) => {
        const aboutEmbed = new ExtendedEmbed()
            .setTitle(title)
            .setDescription(description)
            .addField("Features", `${features.description}
            ${features.commands}
            ${features.funCommands}
            ${features.giveawayCommands}
            ${features.activityCommands}
            ${features.configCommands}
            ${features.dashboard}`)
            .addField("Credits", `${credits.description}
            ${credits.discordjs}
            ${credits.reconlx}`)
            .addField("Links", `${links.server} | ${links.bot} | ${links.github}`)
            .setFooter({
                text: createdBy.text,
                iconURL: createdBy.icon
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
        interaction.followUp({
            embeds: [aboutEmbed]
        });
    }
});