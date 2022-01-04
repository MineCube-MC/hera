import DBD from 'discord-dashboard';
import DarkDashboard from 'dbd-dark-dashboard';
import ExtendedClient from "../Client";
import { Configuration } from "./Modules/Configuration";

export class ClientDashboard {

    public client: ExtendedClient;

    public constructor(client: ExtendedClient) {
        this.client = client;

        let commands = [];
        client.arrayOfCommands.forEach(command => commands.push({
            commandName: command.name,
            commandUsage: "",
            commandDescription: command.description,
            commandAlias: "No Aliases"
        }));

        DBD.Dashboard = DBD.UpdatedClass();

        let urlPort: string;
        if(client.config.dashboard.port === 3000) {urlPort = ":3000"} else urlPort = "";

        const settings = {
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
            theme: DarkDashboard({
                information: {
                    createdBy: client.config.partnership.brandName,
                    websiteTitle: client.user.username + " - Dashboard",
                    websiteName: client.user.username,
                    websiteUrl: client.config.dashboard.domain + urlPort,
                    dashboardUrl: client.config.dashboard.domain + urlPort,
                    supporteMail: "Sike!",
                    supportServer: "https://discord.gg/CNTz9fDYYJ",
                    imageFavicon: "https://i.imgur.com/PXKhUSB.png",
                    iconURL: "https://i.imgur.com/PXKhUSB.png",
                    pageBackGround: "linear-gradient(#2CA8FF, #155b8d)",
                    mainColor: "#2CA8FF",
                    subColor: "#ebdbdb",
                },
                privacyPolicy: {
                    pp: `<meta http-equiv="refresh" content="0; URL='https://www.iubenda.com/privacy-policy/12305593'" />`
                },
                index: {
                    card: {
                        category: "Plenus - Make everything easier",
                        title: "Plenus is a simple Discord bot that's quick to add and easy to setup.",
                        image: "https://i.imgur.com/DvZ30bB.png",
                    },
                    information: {
                        title: "Information",
                        description: "The bot is made with open source libraries and the bot itself is also free and open source available in a GitHub repository." +
                        "<br>The bot has the following features:<br>" +
                        "- <b>Slash commands</b>, the newest Discord commands implementation<br>" +
                        "- <b>Moderation commands</b>, that makes moderation for everyone easier than it was before<br>" +
                        "- <b>Fun commands</b>, helpful for the chat to not die and to express yourself with the funniest commands<br>" +
                        "- <b>Giveaway commands</b>, helpful to start a giveaway and manage it easily<br>" +
                        "- <b>Activity commands</b>, such as YouTube Together and Doodle Crew to entertain yourself and your friends in a voice chat<br>" +
                        "- <b>Administration commands</b>, which help with things like logging, words blacklist and so much more..." +
                        "<br><br>To manage your bot, go to the <a href='/manage'>Server Management page</a>.<br><br>For a list of commands, go to the <a href='/commands'>Commands page</a>."
                    },
                    feeds: {
                        category: "Feeds",
                        title: "Let's do the math!",
                        description: this.botStatistics() + ` Having such a community is amazing for a bot like Plenus and you can be part of this community too. Just add Plenus in your server and start a new journey.`
                    }
                },
                commands: [{
                    category: "Commands",
                    subTitle: "All the available commands of the bot",
                    list: commands
                }]
            }),
            settings: this.dashboardSettings()
        }

        const db = new DBD.Dashboard(settings);
        db.init();
    }

    public dashboardSettings() {
        const settings = [
            {
                categoryId: 'config',
                categoryName: 'Configuration',
                categoryDescription: 'The configuration of the bot in your guild.',
                categoryOptionsList: [
                    {
                        optionId: 'logchannel',
                        optionName: 'Logging Channel',
                        optionDescription: 'Change the log channel in your guild',
                        optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                        getActualSet: async({ guild }) => {
                            return Configuration.getLogChannel(guild);
                        },
                        setNew: async({ guild, newData }) => {
                            try {
                                Configuration.changeLogChannel(guild, newData);
                                return;
                            } catch (e) {
                                return { error: "Can't change log channel." };
                            }
                        }
                    },
                    {
                        optionId: 'welcomechannel',
                        optionName: 'Welcome Channel',
                        optionDescription: 'Change the welcome channel in your guild',
                        optionType: DBD.formTypes.channelsSelect(false, ['GUILD_TEXT']),
                        getActualSet: async({ guild }) => {
                            return Configuration.getWelcomeChannel(guild);
                        },
                        setNew: async({ guild, newData }) => {
                            try {
                                Configuration.changeWelcomeChannel(guild, newData);
                                return;
                            } catch (e) {
                                return { error: "Can't change welcome channel." };
                            }
                        }
                    },
                    {
                        optionId: 'autoroles',
                        optionName: 'Auto Roles',
                        optionDescription: 'Choose which roles of your guild need to be added when a new member joins your guild.',
                        optionType: DBD.formTypes.rolesMultiSelect(false, false),
                        getActualSet: async({ guild }) => {
                            return Configuration.getAutoRoles(guild);
                        },
                        setNew: async({ guild, newData }) => {
                            try {
                                Configuration.setAutoRoles(guild, newData);
                                return;
                            } catch (e) {
                                return { error: "Can't set auto roles." };
                            }
                        }
                    },
                    {
                        optionId: 'ranking',
                        optionName: 'Ranking',
                        optionDescription: 'Enable / Disable the ranking system in your guild.',
                        optionType: DBD.formTypes.switch(false),
                        getActualSet: async({ guild }) => {
                            return await Configuration.getRanking(guild);
                        },
                        setNew: async({ guild, newData }) => {
                            try {
                                Configuration.setRanking(guild, newData);
                                return;
                            } catch (e) {
                                return { error: "Can't enable / disable the ranking system." };
                            }
                        }
                    }
                ]
            }
        ]
        return settings;
    }

    public botStatistics(): string {
        const servers = this.client.guilds.cache.size;
        let users: number = 0;
        let channels: number = 0;
        this.client.guilds.cache.forEach((guild) => {
            users = users + guild.members.cache.size;
            channels = channels + guild.channels.cache.size;
        });
        return `Plenus takes care of <b>${servers}</b> servers, <b>${users}</b> users and <b>${channels}</b> channels.`
    }

}