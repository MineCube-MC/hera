import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection, partnersCollection, welcomeChannelCollection, moderationLogsCollection, rolesCollection } from '../Collections';
import { ClientPrompt } from '../Terminal';
import { connect } from 'mongoose';
import { moderationLogsSchema } from '../Models/moderationLogs';
import { welcomeChannelSchema } from '../Models/welcomeChannel';
import { partnersSchema } from '../Models/partners';
import { rolesSchema } from '../Models/roles';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log('[Client] Logged in as ' + chalk.italic(client.user.tag));
        console.log(`[Client] Client => ${chalk.greenBright('Ready!')}`);

        // console.log(client.arrayOfCommands);
        if(client.config.testMode.enabled) {
            client.guilds.cache.get(client.config.testMode.guild).commands.set(client.arrayOfCommands);
        } else {
            client.application.commands.set(client.arrayOfCommands);
        }

        connect(client.config.mongoURI, {
            "useUnifiedTopology": true,
            "useFindAndModify": false,
            "useNewUrlParser": true
        }).then(() => {
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

            console.log(`[Client] Database => ${chalk.greenBright('Connected!')}`);
        }).finally(() => {
            client.tasks.forEach(async task => {
                setInterval(async () => {
                    await task.execute(client);
                }, task.interval * 1000);
            });
            new ClientPrompt(client);
        });

        client.user.setStatus('dnd');
    }
}