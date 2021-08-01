import { Event } from '../Interfaces';
import chalk from 'chalk';
import { blacklistedWordsSchema } from '../Models/blacklistedWords';
import { blacklistedWordsCollection, prefixCollection } from '../Collections';
import { prefixSchema } from '../Models/prefix';
import packageData from '../../package.json';
import { ClientPrompt } from '../Terminal';
import { connect, disconnect } from 'mongoose';

export const event: Event = {
    name: 'ready',
    run: (client) => {
        console.log('[ApexieClient] Logged in as ' + chalk.italic(client.user.tag));
        console.log(`[ApexieClient] Client => ${chalk.greenBright('Ready!')} (version ${packageData.version})`);
        console.log('[ApexieClient] Type ' + chalk.italic(`"${client.config.prefix}help"`) + ' for a list of commands.');

        connect(client.config.mongoURI, {
            "useUnifiedTopology": true,
            "useFindAndModify": false,
            "useNewUrlParser": true
        }).then(() => {
            console.log(`[ApexieClient] Database => ${chalk.greenBright('Connected!')}`);
            new ClientPrompt(client);
        });

        client.user.setStatus('dnd');
        client.user.setActivity(`Still W.I.P. | ${client.config.prefix}help`);

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

    }
}