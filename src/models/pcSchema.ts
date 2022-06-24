import mongo from "mongoose";

export default mongo.model(
    "pc",
    new mongo.Schema({
        userID: { type: String, require: true },
        url: { type: String, require: true },
        password: { type: String, require: true }
    })
);