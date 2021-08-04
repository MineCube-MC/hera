import Client from './Client';
new Client({
    intents: [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_BANS',
        'GUILD_MEMBERS',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_INTEGRATIONS',
        'GUILD_EMOJIS_AND_STICKERS',
        'GUILD_MESSAGE_TYPING']
}).init();