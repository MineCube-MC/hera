import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";
import Canvas from 'canvas';

export default new Event("guildMemberAdd", async(member) => {
    if(member.user.bot) return;
    let profile = await profileSchema.create({
        userID: member.id,
        serverID: member.guild.id,
        warnings: 0
    });
    profile.save();

    // Work in progress: Welcome Cards
    // var welcomeCanvas: { create, context: { font, fillStyle } };
});