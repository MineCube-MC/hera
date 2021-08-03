import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection, prefixCollection, welcomeChannelCollection } from '../Collections';
import { prefixSchema } from '../Models/prefix';
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
        console.log('[Client] Type ' + chalk.italic(`"${client.config.prefix}help"`) + ' for a list of commands.');

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
    
            prefixSchema.find().then((data) => {
                data.forEach((val: any) => {
                    prefixCollection.set(val.Guild, val.Prefix);
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