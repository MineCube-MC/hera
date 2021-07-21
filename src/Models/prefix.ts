import mongo from 'mongoose';

export const prefixSchema = mongo.model(
    "prefix",
    new mongo.Schema({
        Guild: String,
        Prefix: String
    })
)