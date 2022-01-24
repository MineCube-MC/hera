import { Event } from "../structures/Event";

export default new Event("ready", (client) => {
    if(client.isReady) {
        console.log("Bot is online");

        client.user.setActivity("Discord", { type: "COMPETING" });
    }
});