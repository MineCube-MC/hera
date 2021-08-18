import mongo from 'mongoose';

export const rolesSchema = mongo.model(
    "roles",
    new mongo.Schema({
        Role: String,
        Users: Array
    })
)