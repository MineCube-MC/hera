import mongo from 'mongoose';

export const blacklistedWordsSchema = mongo.model(
    "blacklisted-words",
    new mongo.Schema({
        Guild: String,
        Words: [String]
    })
)