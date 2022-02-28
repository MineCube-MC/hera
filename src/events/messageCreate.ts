import guildSchema from "../models/guildSchema";
import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";
import Levels from 'discord-xp';

export default new Event("messageCreate", async (message) => {
    const member = message.member;
    if(member.user.bot) return;
    let profileData;
    try {
        profileData = await profileSchema.findOne({ userID: member.id });
            if(!profileData) {
            let profile = await profileSchema.create({
                userID: member.id,
                serverID: member.guild.id,
                warnings: 0
            });
            profile.save();
            profileData = await profileSchema.findOne({ userID: member.id });
        }
    } catch (e) {
        console.error(e);
    }

    let guildData;
    try {
        guildData = await guildSchema.findOne({ serverID: member.guild.id });
        if(!guildData) {
            let guild = await guildSchema.create({
                serverID: member.guild.id,
                welcome: {
                    enabled: false,
                    channelID: "none",
                    text: ":wave: Hello {member}, welcome to {guild}!"
                },
                autoRoles: [],
                blacklist: []
            });
            guild.save();
            guildData = await guildSchema.findOne({ serverID: member.guild.id });
        }
    } catch (e) {
        console.error(e);
    }

    const msgWords = message.content.toLowerCase().split(" ");
    let toDelete: boolean = false;

    msgWords.map((content) => {
        if((guildData.blacklist as string[]).includes(content.toLowerCase())) toDelete = true;
    })

    if(toDelete) {
        if(!message.guild.me.permissions.has("MANAGE_MESSAGES")) return;
        message.delete();
        return;
    }

    const randomXp = Math.floor(Math.random() * 9) + 1;
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    if(hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`Congratulations, ${message.author}. You made it to level **${user.level}**`);
    }
});