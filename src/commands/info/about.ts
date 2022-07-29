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
            .addFields([
                {
                    name: "Features",
                    value: JSON.parse(features.toString()).join("\n")
                },
                {
                    name: "Credits",
                    value: JSON.parse(credits.toString()).join("\n")
                },
                {
                    name: "Links",
                    value: `${links.server} | ${links.bot} | ${links.github}`
                }
            ])
            .setFooter({
                text: createdBy.text,
                iconURL: createdBy.icon
            })
            .setThumbnail(client.user.displayAvatarURL());
        interaction.reply({
            embeds: [aboutEmbed]
        });
    }
});