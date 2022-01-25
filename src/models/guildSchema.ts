import mongo from "mongoose";

export default mongo.model(
    "guild",
    new mongo.Schema({
        serverID: { type: String, require: true, unique: true },
        welcome: {
            enabled: { type: Boolean },
            channelID: { type: String },
            text: { type: String }
        }
    })
);