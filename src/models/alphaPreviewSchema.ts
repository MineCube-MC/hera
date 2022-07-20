import mongo from "mongoose";

export default mongo.model(
    "alpha-preview",
    new mongo.Schema({
        userID: { type: String, require: true, unique: true },
        username: { type: String, require: true },
        previewKey: { type: String, require: true }
    })
);