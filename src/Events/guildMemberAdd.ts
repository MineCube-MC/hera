import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";

export default new Event("guildMemberAdd", async(member) => {
    if(member.user.bot) return;
    let profile = await profileSchema.create({
        userID: member.id,
        serverID: member.guild.id,
        warnings: 0
    });
    profile.save();
});