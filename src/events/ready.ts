import { ActivityType } from "discord.js";
import { Event } from "../structures/Event";

export default new Event("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity("Discord", { type: ActivityType.Competing });
});
