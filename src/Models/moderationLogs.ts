import mongo from 'mongoose';

export const moderationLogsSchema = mongo.model(
    "moderation-logs",
    new mongo.Schema({
        Guild: String,
        Channel: String
    })
)