import { Dashboard, formTypes } from "discord-dashboard";
import CaprihamTheme from "dbd-capriham-theme";
import ExtendedClient from "../Client";
import { Command } from "../Interfaces";

export class ClientDashboard {

    public client: ExtendedClient;

    public constructor(client: ExtendedClient) {
        this.client = client;

        let cmdList = [];
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
                secret: this.client.config.clientSecret
            },
            redirectUri: this.client.config.dashboard.redirectUri,
            domain: this.client.config.dashboard.domain,
            bot: this.client,
            ownerIDs: this.client.config.owners,
            acceptPrivacyPolicy: true,
            sessionFileStore: true,
            invite: {
                redirectUri: this.client.config.dashboard.redirectUri,
                permissions: 8,
                clientId: this.client.config.clientId,
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
                        description: "Assistants Discord Bot management panel. Assistants Bot was created to give others the ability to do what they want. Just.<br>That's an example text.<br><br><b><i>Feel free to use HTML</i></b>",
                        image: "https://www.geeklawblog.com/wp-content/uploads/sites/528/2018/12/liprofile-656x369.png",
                    },
                    information: {
                        title: "Information",
                        description: "To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>.<br><br><b><i>You can use HTML there</i></b>"
                    },
                    feeds: {
                        title: "Feeds",
                        list: [
                            {
                                icon: "fa fa-user",
                                text: "New user registered",
                                timeText: "Just now",
                                bg: "bg-light-info"
                            },
                            {
                                icon: "fa fa-server",
                                text: "Server issues",
                                timeText: "3 minutes ago",
                                bg: "bg-light-danger"
                            }
                        ]
                    },
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
                categoryId: 'setup',
                categoryName: 'Setup',
                categoryDescription: 'The general bot settings.',
                categoryOptionsList: [
                    {
                        optionId: 'nickname',
                        optionName: 'Nickname',
                        optionDescription: 'Change the bot nickname in your guild',
                        optionType: formTypes.input("Bot username", 1, 16, false, true),
                        getActualSet: async({ guild }) => {
                            const guildsettings = await this.client.guilds.cache.get(guild.id).me;
                            if (guildsettings.nickname == null) {
                                var nicknamer = guildsettings.user.username;
                            } else {
                                var nicknamer = guildsettings.nickname;
                            }
                            return nicknamer;
                        },
                        setNew: async({ guild, newData }) => {
                            return { error: 'Still work in progress...' };
                        }
                    }
                ]
            }
        ]
        return settings;
    }

}