import mongo from "mongoose";

export const rankingSchema = mongo.model(
    "ranking",
    new mongo.Schema({
        Guild: {
            type: String,
            required: true
        },
        Enabled: {
            type: Boolean,
            required: true
        }
    })
)