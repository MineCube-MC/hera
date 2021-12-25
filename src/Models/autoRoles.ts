import mongo from 'mongoose';

export const autoRolesSchema = mongo.model(
    "auto-roles",
    new mongo.Schema({
        Guild: String,
        AutoRoles: Array
    })
)