import profileSchema from "../models/profileSchema";
import { Event } from "../structures/Event";
import Canvas from 'canvas';
import { AllowedImageSize, MessageAttachment, TextChannel } from "discord.js";
import guildSchema from "../models/guildSchema";
import path from "path";
import fs from "fs"

export default new Event("guildMemberAdd", async(member) => {
    if(member.user.bot) return;
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

    if(member.guild.me.permissions.has("MANAGE_ROLES")) {
        (guildData.autoRoles as string[]).forEach(roleID => {
            const role = member.guild.roles.cache.find(role => role.id === roleID);
            if(role) {
                if(role.position >= member.guild.me.roles.highest.position) return;
                if(member.roles.cache.has(role.id)) return;
                member.roles.add(role);
            }
        });   
    }

    if(guildData.welcome.enabled) {
        var number = Math.floor(Math.random() * 6) + 1;
        
        const dim = {
            height: 500,
            width: 1024,
            margin: 50
        }

        const av = {
            size: 128,
            x: 450,
            y: 140
        }

        let username = member.user.username
        let discrim = member.user.discriminator
        let avatarURL = member.user.displayAvatarURL({format: "png", dynamic: false, size: (av.size as AllowedImageSize)})

        const canvas = Canvas.createCanvas(dim.width, dim.height)
        const ctx = canvas.getContext("2d")
        

        const backimg = await Canvas.loadImage(path.join(process.cwd() + `/assets/cards/card-${number}.png`))
        ctx.drawImage(backimg, 0, 0)

        ctx.fillStyle = "rgba(0,0,0,0.8)"
        ctx.fillRect(dim.margin, dim.margin, dim.width - 2 * dim.margin, dim.height - 2 * dim.margin)

        const avimg = await Canvas.loadImage(avatarURL)
        ctx.save()
    
        ctx.beginPath()
        ctx.arc(av.x + av.size / 2, av.y + av.size / 2, av.size / 2, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(avimg, av.x, av.y)
        ctx.restore()

        ctx.fillStyle = "white"
        ctx.textAlign = "center"

        ctx.font = "50px Roboto"
        ctx.fillText("Welcome", dim.width/2, dim.margin + 70)

        ctx.font = "60px Roboto"
        ctx.fillText(username + "#" + discrim, dim.width/2, dim.height - dim.margin - 125)

        ctx.font = "40px Roboto"
        ctx.fillText("to the server", dim.width / 2, dim.height - dim.margin - 50)
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
