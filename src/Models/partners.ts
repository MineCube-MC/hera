import mongo from 'mongoose';

export const partnersSchema = mongo.model(
    "partners",
    new mongo.Schema({
        Guild: String,
        Name: String
    })
)