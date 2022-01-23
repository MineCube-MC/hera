import { ColorResolvable, MessageActionRow, MessageButton, TextChannel, Util } from "discord.js";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "btnroles",
    description: "Manage the button roles in your current guild",
    userPermissions: ["MANAGE_ROLES"],
    options: [
        {
            name: "create",
            description: "Create a button role in your guild",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "role",
                    description: "The role for the button",
                    type: "ROLE",
                    required: true
                },
                {
                    name: "description",
                    description: "The description of the embed for the button role",
                    type: "STRING",
                    required: true
                },
                {
                    name: "channel",
                    description: "The channel you want to send the embed with the button",
                    type: "CHANNEL",
                    channelTypes: ["GUILD_TEXT"],
                    required: true
                },
                {
                    name: "emoji",
                    description: "The emoji for the button",
                    type: "STRING",
                    required: false
                },
                {
                    name: "title",
                    description: "The title of the embed",
                    type: "STRING",
                    required: false
                },
                {
                    name: "label",
                    description: "The label of the button",
                    type: "STRING",
                    required: false
                },
                {
                    name: "color",
                    description: "The color of the embed (needs to be in HEX format)",
                    type: "STRING",
                    required: false
                }
            ]
        }
    ],
    run: async({ interaction }) => {
        const query = interaction.options.getSubcommand();
        const role = interaction.options.getRole("role");
        const description = interaction.options.getString("description");
        const channel = interaction.options.getChannel("channel") as TextChannel;
        const emoji = interaction.options.getString("emoji");
        const title = interaction.options.getString("title");
        const label = interaction.options.getString("label");
        var color: ColorResolvable = interaction.options.getString("color") as ColorResolvable;

        function isValidColor(str) {
            return str.match(/^#[a-f0-9]{6}$/i) !== null;
        }

        if(query === "create") {
            const buttonEmbed = new ExtendedEmbed()
                .setTitle(role.name)
                .setDescription(description)
                .setFooter({
                    text: interaction.guild.name,
                    iconURL: interaction.guild.iconURL({ dynamic: true })
                });
            
            if(color) {
                if(isValidColor(color)) {
                    buttonEmbed.setColor(color);
                } else return interaction.reply({
                    content: `The color isn't in a valid HEX format. A valid HEX format color should be like this: \`#60f20c\``,
                    ephemeral: true
                });
            }
            if(title) buttonEmbed.setTitle(title);

            const roleButton = new MessageButton()
                .setLabel(role.name)
                .setStyle("PRIMARY")
                .setCustomId(`role-${role.id}`);
            
            if(label) roleButton.setLabel(label);
            
            if(emoji) {
                if(Util.parseEmoji(emoji)) {
                    roleButton.setEmoji(emoji);
                } else return interaction.reply({
                    content: `The emoji doesn't use a valid format. A valid Discord format emoji should be like this: \`:joy:\``,
                    ephemeral: true
                });
            }

            channel.send({ embeds: [buttonEmbed], components: [
                new MessageActionRow()
                    .addComponents(roleButton)
            ] });
        }
    }
});