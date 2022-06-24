import { Command } from "../../structures/Command";
import pcSchema from "../../models/pcSchema";
import axios from "axios";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "pc",
    description: "Manage your PC remotely",
    options: [
        {
            name: "shutdown",
            description: "Shutdown your PC",
            type: "SUB_COMMAND"
        },
        {
            name: "reboot",
            description: "Reboot your PC",
            type: "SUB_COMMAND"
        },
        {
            name: "config",
            description: "Setup your PC to be used with this bot",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "url",
                    description: "The url of the API that will be used to connect to your PC",
                    type: "STRING",
                    required: true
                },
                {
                    name: "password",
                    description: "The password generated by the program to connect to your PC",
                    type: "STRING",
                    required: true
                }
            ]
        }
    ],
    run: async ({ interaction, args }) => {
        if (args.getSubcommand() === "config") {
            const url = args.getString("url");
            const password = args.getString("password");

            let pc;
            try {
                pc = await pcSchema.findOne({ userID: interaction.user.id });
                if (!pc) {
                    pc = await pcSchema.create({
                        userID: interaction.user.id,
                        url: url,
                        password: password
                    });
                }
            } catch (e) {
                console.error(e);
            }

            await axios.get(`${url}/status?password=${password}`).then((res) => {
                if (res.status === 200) {
                    const embed = new ExtendedEmbed()
                    .setTitle("Remote Control")
                    .setDescription("The bot is now connected with your PC and can be used to control it remotely :tada:")
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }).catch(() => {
                const embed = new ExtendedEmbed()
                .setTitle("Remote Control")
                .setDescription("The bot was unable to connect to your PC :sob:")
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
        } else if (args.getSubcommand() === "shutdown") {
            let pc;
            try {
                pc = await pcSchema.findOne({ userID: interaction.user.id });
                if (!pc) {
                    interaction.reply({ embeds: [
                        new ExtendedEmbed()
                        .setTitle("Remote Control")
                        .setDescription("You haven't setup your PC yet. You can do so by using the `/pc config` command.")
                    ] });
                }
            } catch (e) {
                console.error(e);
            }

            const url = pc.url;
            const password = pc.password;

            await axios.get(`${url}/shutdown?password=${password}`).then((res) => {
                if (res.status === 200) {
                    const embed = new ExtendedEmbed()
                    .setTitle("Remote Control")
                    .setDescription("The bot has successfully shutdown your PC :tada:")
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }).catch(() => {
                const embed = new ExtendedEmbed()
                .setTitle("Remote Control")
                .setDescription("Couldn't connect to the API of your PC. Please check your configuration.")
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
        } else if (args.getSubcommand() === "reboot") {
            let pc;
            try {
                pc = await pcSchema.findOne({ userID: interaction.user.id });
                if (!pc) {
                    interaction.reply({ embeds: [
                        new ExtendedEmbed()
                        .setTitle("Remote Control")
                        .setDescription("You haven't setup your PC yet. You can do so by using the `/pc config` command.")
                    ] });
                }
            } catch (e) {
                console.error(e);
            }

            const url = pc.url;
            const password = pc.password;

            await axios.get(`${url}/reboot?password=${password}`).then((res) => {
                if (res.status === 200) {
                    const embed = new ExtendedEmbed()
                    .setTitle("Remote Control")
                    .setDescription("The bot is successfully rebooting your PC :tada:")
                    interaction.reply({ embeds: [embed], ephemeral: true });
                }
            }).catch(() => {
                const embed = new ExtendedEmbed()
                .setTitle("Remote Control")
                .setDescription("Couldn't connect to the API of your PC. Please check your configuration.")
                interaction.reply({ embeds: [embed], ephemeral: true });
            });
        }
    }
});