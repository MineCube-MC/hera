import { Dashboard, formTypes } from "discord-dashboard";
import CaprihamTheme from "dbd-capriham-theme";
import ExtendedClient from "../Client";
import { Command } from "../Interfaces";
import { Configuration } from "./Modules/Configuration";

export class ClientDashboard {

    public client: ExtendedClient;

    public constructor(client: ExtendedClient) {
        this.client = client;

        let cmdList: any[] = [];
        client.arrayOfCommands.forEach((command: Command) => {
            let cmd = {
                commandName: command.name,
                // commandUsage: "Slash command",
                commandDescription: command.description
            };
            cmdList.push(cmd);
        });

        const settings: config_options = {
            port: client.config.dashboard.port,
            client: {
                id: client.config.clientId,
                secret: client.config.clientSecret
            },
            redirectUri: client.config.dashboard.redirectUri,
            domain: client.config.dashboard.domain,
            bot: client,
            ownerIDs: client.config.owners,
            acceptPrivacyPolicy: true,
            sessionFileStore: true,
            invite: {
                redirectUri: client.config.dashboard.redirectUri,
                permissions: 8,
                clientId: client.config.clientId,
                scopes: [
                    'bot',
                    'application.commands'
                ],
                otherParams: ""
            },
            supportServer: {
                slash: 'support-server',
                inviteUrl: 'https://discord.gg/CNTz9fDYYJ'
            },
            noCreateServer: false,
            guildAfterAuthorization: {
                use: true,
                guildId: '924159913024958505'
            },
            theme: CaprihamTheme({
                websiteName: "Plenus",
                iconURL: 'https://i.imgur.com/bHAUaCl.png',
                index: {
                    card: {
                        title: "Plenus - Make everything easier",
                        description: "Plenus is a simple Discord bot that's quick to add and easy to setup. The bot is made with open source libraries and the bot itself is also free and open source available in a GitHub repository." +
                        "<br>The bot has the following features:<br>" +
                        "- <b>Slash commands</b>, the newest Discord commands implementation<br>" +
                        "- <b>Moderation commands</b>, that makes moderation for everyone easier than it was before<br>" +
                        "- <b>Fun commands</b>, helpful for the chat to not die and to express yourself with the funniest commands<br>" +
                        "- <b>Activity commands</b>, such as YouTube Together and Doodle Crew to entertain yourself and your friends in a voice chat<br>" +
                        "- <b>Administration commands</b>, which help with things like logging, words blacklist and so much more...",
                        image: "https://www.geeklawblog.com/wp-content/uploads/sites/528/2018/12/liprofile-656x369.png",
                    },
                    information: {
                        title: "Information",
                        description: "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>."
                    },
                    feeds: {
                        title: "Feeds",
                        list: [
                            {
                                icon: "fa fa-server",
                                text: "Bot released to the public and open-sourced!",
                                timeText: "28/12/2021",
                                bg: "bg-light-danger"
                            }
                        ]
                    }
                },
                commands: {
                    pageTitle: "Commands",
                    table: {
                        title: "List",
                        subTitle: "All the available commands of the bot",
                        list: cmdList
                    }
                }
            }),
            settings: this.dashboardSettings()
        }

        const db = new Dashboard(settings);
        db.init();
    }

    public dashboardSettings(): settings_options {
        const settings: settings_options = [
            {
                categoryId: 'config',
                categoryName: 'Configuration',
                categoryDescription: 'The configuration of the bot in your guild.',
                categoryOptionsList: [
                    {
                        optionId: 'logchannel',
                        optionName: 'Logging Channel',
                        optionDescription: 'Change the log channel in your guild',
                        optionType: formTypes.channelsSelect(false),
                        getActualSet: async({ guild }) => {
                            return Configuration.getLogChannel(guild);
                        },
                        setNew: async({ guild, newData }) => {
                            try {
                                Configuration.changeLogChannel(newData);
                                return;
                            } catch (e) {
                                return { error: "Can't change log channel." };
                            }
                        }
                    }
                ]
            }
        ]
        return settings;
    }

}