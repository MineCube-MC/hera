import mongo from "mongoose";

export default mongo.model(
    "profile",
    new mongo.Schema({
        userID: { type: String, require: true, unique: true },
        serverID: { type: String, require: true },
        warnings: { type: Number, default: 0 }
    })
);