import Client from './Client';
import path from 'path';
import { readFileSync } from 'fs';

new Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_BANS',
        'GUILD_MEMBERS',
        'GUILD_PRESENCES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES',
        'GUILD_INTEGRATIONS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MESSAGE_TYPING']
}).init(JSON.parse(readFileSync(path.join(process.cwd() + '/config.json')).toString()));