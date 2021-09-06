import mongo from 'mongoose';

export const guildsSchema = mongo.model(
    "guilds",
    new mongo.Schema({
        guild: String,
        blacklist: Array,
        channels: Array({
            welcome: String,
            goodbye: String,
            logging: String
        }),
        roles: [{
            role: String,
            users: Array
        }]
    })
)