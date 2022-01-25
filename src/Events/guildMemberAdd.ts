import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";
import Canvas from 'canvas';
import { MessageAttachment, TextChannel } from "discord.js";
import guildSchema from "../models/guildSchema";
import path from 'path';

export default new Event("guildMemberAdd", async(member) => {
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
                }
            });
            guild.save();
            guildData = await guildSchema.findOne({ serverID: member.guild.id });
        }
    } catch (e) {
            console.error(e);
    }

    if(guildData.welcome.enabled) {
        var canvas = Canvas.createCanvas(1024, 500);
        var context = canvas.getContext('2d');
        context.font = '72px sans-serif';
        context.fillStyle = '#ffffff';

        var number = Math.floor(Math.random() * 6) + 1;

        Canvas.loadImage(`../../assets/cards/card-${number}.png`).then(async(img) => {
            context.drawImage(img, 0, 0, 1024, 500);
            context.fillText("welcome", 360, 360);
            context.beginPath();
            context.arc(512, 166, 128, 0, Math.PI * 2, true);
            context.stroke();
            context.fill();
        });

        context.font = '42px sans-serif',
        context.textAlign = 'center';
        context.fillText(member.user.tag.toUpperCase(), 512, 410);
        context.font = '32px sans-serif';
        context.fillText(`You are the ${member.guild.memberCount}th`, 512, 455);
        context.beginPath();
        context.arc(512, 166, 119, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();
        await Canvas.loadImage(member.user.displayAvatarURL({format: 'png', size: 1024}))
        .then(img => {
            context.drawImage(img, 393, 47, 238, 238);
        });
        const welcomeChannel = member.guild.channels.cache.find(ch => ch.id === guildData.welcome.channelID) as TextChannel;
        if(welcomeChannel) {
            let message = (guildData.welcome.text as string).replaceAll("{member}", `${member}`).replaceAll("{guild}", member.guild.name);
            welcomeChannel.send({
                content: message,
                files: [new MessageAttachment(canvas.toBuffer(), `welcome-${member.id}.png`)]
            });
        }
    }
});