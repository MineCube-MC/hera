import mongo from 'mongoose';

export const guildsSchema = mongo.model(
    "guilds",
    new mongo.Schema({
        guild: String,
        blacklist: Array(String),
        channels: Array({
            welcome: String,
            goodbye: String,
            logging: String
        }),
        roles: Array({
            role: String,
            users: Array
        }),
        autoRoles: Array(String),
        youtube: Array(String),
        twitch: Array(String)
    })
)