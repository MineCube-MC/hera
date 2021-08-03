import mongo from 'mongoose';

export const welcomeChannelSchema = mongo.model(
    "welcome-channel",
    new mongo.Schema({
        Guild: String,
        Channel: String
    })
)