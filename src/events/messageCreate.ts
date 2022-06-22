import guildSchema from "../models/guildSchema";
import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";
import Levels from 'discord-xp';
import { TextChannel } from "discord.js";
import { ExtendedEmbed } from "../structures/Embed";

export default new Event("messageCreate", async (message) => {
    const member = message.member;
    if(message.webhookId || member.user.bot) return;
    let profileData;
    try {
        profileData = await profileSchema.findOne({ userID: member.id, serverID: member.guild.id });
            if(!profileData) {
            let profile = await profileSchema.create({
                userID: member.id,
                serverID: member.guild.id,
                warnings: 0
            });
            profile.save();
            profileData = await profileSchema.findOne({ userID: member.id, serverID: member.guild.id });
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
                logs: {
                    enabled: false,
                    channelID: "none"
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

    const logChannel = message.guild.channels.cache.get(guildData.logs.channelID) as TextChannel;

    const randomXp = Math.floor(Math.random() * 9) + 1;
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomXp);
    if(hasLeveledUp) {
        const user = await Levels.fetch(message.author.id, message.guild.id);
        message.channel.send(`Congratulations, ${message.author}. You made it to level **${user.level}**`);
    }
});