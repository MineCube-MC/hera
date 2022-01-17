import { Event } from "../structures/Event";
import guildSchema from "../models/guild";

export default new Event("guildMemberAdd", async(member) => {
    if(member === member.guild.me) {
        await new guildSchema({
            id: member.guild.id
        }).save();
    }
});