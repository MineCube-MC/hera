import mongo from "mongoose";

export default mongo.model(
  "ticket",
  new mongo.Schema({
    serverID: { type: String, require: true },
    channelID: { type: String, require: true, unique: true },
    open: { type: Boolean, require: true }
  })
);