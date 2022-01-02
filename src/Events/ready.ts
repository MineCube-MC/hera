import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection, partnersCollection, welcomeChannelCollection, moderationLogsCollection, rolesCollection, autoRolesCollection, rankingCollection } from '../Collections';
import { ClientPrompt } from '../Terminal';
import { connect } from 'mongoose';
import { moderationLogsSchema } from '../Models/moderationLogs';
import { welcomeChannelSchema } from '../Models/welcomeChannel';
import { partnersSchema } from '../Models/partners';
import { rolesSchema } from '../Models/roles';
import { autoRolesSchema } from '../Models/autoRoles';
import { ClientDashboard } from '../Dashboard';
import DBD from 'discord-dashboard';
import { rankingSchema } from '../Models/ranking';

export const event: Event = {
    name: 'ready',
    run: async (client) => {
        if (client.config.terminal.verbose) console.log('Logged in as ' + chalk.italic(client.user.tag));
        if (client.config.terminal.verbose) console.log(`Client => ${chalk.greenBright('Ready!')}`);

        if(client.config.testMode.enabled) {
            client.guilds.cache.get(client.config.testMode.guild).commands.set(client.arrayOfCommands);
        } else {
            // console.log(client.arrayOfCommands);
            client.application.commands.set(client.arrayOfCommands);
        }

        connect(client.config.mongoURI).then(() => {
            blacklistedWordsSchema.find().then((data) => {
                data.forEach((val: any) => {
                    blacklistedWordsCollection.set(val.Guild, val.Words);
                });
            });
    
            moderationLogsSchema.find().then((data) => {
                data.forEach((val: any) => {
                    moderationLogsCollection.set(val.Guild, val.Channel);
                });
            });

            welcomeChannelSchema.find().then((data) => {
                data.forEach((val: any) => {
                    welcomeChannelCollection.set(val.Guild, val.Channel);
                });
            });

            partnersSchema.find().then((data) => {
                data.forEach((val: any) => {
                    partnersCollection.set(val.Guild, val.Name);
                });
            });

            rolesSchema.find().then((data) => {
                data.forEach((val: any) => {
                    rolesCollection.set(val.Role, val.Users);
                });
            });

            autoRolesSchema.find().then((data) => {
                data.forEach((val: any) => {
                    autoRolesCollection.set(val.Guild, val.AutoRoles);
                });
            });

            rankingSchema.find().then((data) => {
                data.forEach((val: any) => {
                    rankingCollection.set(val.Guild, val.Enabled);
                });
            });

            if (client.config.terminal.verbose) console.log(`Database => ${chalk.greenBright('Connected!')}`);
        }).finally(async () => {
            client.tasks.forEach(async task => {
                setInterval(async () => {
                    await task.execute(client);
                }, task.interval * 1000);
            });
            await DBD.useLicense(client.config.dashboard.license);
            new ClientDashboard(client);
            new ClientPrompt(client);
        });
    }
}