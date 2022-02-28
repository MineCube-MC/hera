import guildSchema from "../../models/guildSchema";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { createdBy } from "../../../assets/locale.json";

export default new Command({
    name: "blacklist",
    description: "Manage the server blacklist",
    userPermissions: ["MANAGE_MESSAGES"],
    options: [
        {
            name: "add",
            description: "Add a word to the blacklist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "word",
                    description: "The word to be added to the blacklist",
                    type: "STRING"
                }
            ]
        },
        {
            name: "remove",
            description: "Remove a word to the blacklist",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "word",
                    description: "The word to be removed to the blacklist",
                    type: "STRING"
                }
            ]
        },
        {
            name: "list",
            description: "Shows the server blacklist",
            type: "SUB_COMMAND"
        }
    ],
    run: async({ interaction, args }) => {
        const query = args.getSubcommand();
        const word = args.getString("word");

        let guildData;
        try {
            guildData = await guildSchema.findOne({ serverID: interaction.guildId });
            if(!guildData) {
                let guild = await guildSchema.create({
                    serverID: interaction.guildId,
                    welcome: {
                        enabled: false,
                        channelID: "none",
                        text: ":wave: Hello {member}, welcome to {guild}!"
                    },
                    logs: {
                        enabled: false,
                        channelID: "none"
                    },
                    autoRoles: [],
                    blacklist: []
                });
                guild.save();
                guildData = await guildSchema.findOne({ serverID: interaction.guildId });
            }
        } catch (e) {
            console.error(e);
        }

        if(query === "add") {
            if((guildData.blacklist as string[]).includes(word)) return interaction.reply({
                content: `The word has already been added to the blacklist.`,
                ephemeral: true
            });

            const response = await guildSchema.findOneAndUpdate({ serverID: interaction.guildId }, {
                $push: {
                    blacklist: word
                }
            });
            return interaction.reply({
                content: `The word \`${word}\` has been added to the blacklist.`,
                ephemeral: true
            });
        } else if(query === "remove") {
            if(!(guildData.blacklist as string[]).includes(word)) return interaction.reply({
                content: `This word isn't included in the blacklist.`,
                ephemeral: true
            });

            const response = await guildSchema.findOneAndUpdate({ serverID: interaction.guildId }, {
                $pull: {
                    blacklist: word
                }
            });
            return interaction.reply({
                content: `The word \`${word}\` has been removed from the blacklist.`,
                ephemeral: true
            });
        } else if(query === "list") {
            const blacklist = guildData.blacklist as string[];
            return interaction.reply({
                ephemeral: true,
                embeds: [
                    new ExtendedEmbed()
                    .setTitle(`${interaction.guild.name}'s blacklist`)
                    .setDescription("The followings are the banned words in this Discord server. If a sent message contains one of the words below, the message will automatically be deleted.")
                    .addField("Words", `${blacklist.length ? blacklist.map(word => `\`${word}\``).join(", ") : "No words added"}`)
                    .setFooter({
                        text: createdBy.text,
                        iconURL: createdBy.icon
                    })
                ]
            });
        }
    }
});