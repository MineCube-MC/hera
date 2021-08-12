import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection, welcomeChannelCollection } from '../Collections';
import { ClientPrompt } from '../Terminal';
import { connect } from 'mongoose';
import { moderationLogsSchema } from '../Models/moderationLogs';
import { moderationLogsCollection } from '../Collections/moderationLogs';
import { welcomeChannelSchema } from '../Models/welcomeChannel';

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

            console.log(`[Client] Database => ${chalk.greenBright('Connected!')}`);
        }).finally(() => {
            new ClientPrompt(client);
        });

        client.user.setStatus('dnd');
        client.user.setActivity(`Still W.I.P. | ${client.config.prefix}help`);

    }
}