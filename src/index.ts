import Client from './Client';
import { config } from '../config';

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
}).init(config);