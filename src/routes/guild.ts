import { ChannelType } from "discord.js";
import express from "express";
import guildSchema from "../models/guildSchema";
import { API } from "../structures/API";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(403).json({
        status: 403,
        error: "GUILD_NOT_GIVEN"
    });
});

router.get("/:guild", async(req, res) => {
    if(!req.params.guild) return res.status(403).json({
        status: 403,
        error: "GUILD_NOT_GIVEN"
    });
    if(API.client.guilds.cache.get(req.params.guild)) {
        const guild = API.client.guilds.cache.get(req.params.guild);
        let guildData;
        try {
            guildData = await guildSchema.findOne({ serverID: guild.id });
            if(!guildData) {
                let guildDocument = await guildSchema.create({
                    serverID: guild.id,
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
            guildDocument.save();
            guildData = await guildSchema.findOne({ serverID: guild.id });
            }
        } catch (e) {
            console.error(e);
        }
        res.status(200).json({
            status: 200,
            name: guild.name,
            members: {
                total: guild.memberCount,
                users: guild.members.cache.filter(member => !member.user.bot).size,
                bots: guild.members.cache.filter(member => member.user.bot).size
            },
            channels: {
                total: guild.channels.cache.size,
                text: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildText).size,
                news: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildNews).size,
                voice: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildVoice).size,
                stage: guild.channels.cache.filter(channel => channel.type === ChannelType.GuildStageVoice).size
            },
            welcome: {
                enabled: guildData.welcome.enabled,
                channel_id: guildData.welcome.channelID,
                text: guildData.welcome.text
            },
            logs: {
                enabled: guildData.logs.enabled,
                channel_id: guildData.logs.channelID
            },
            autoRoles: guildData.autoRoles
        });
    } else {
        res.status(404).json({
            status: 404,
            error: "GUILD_NOT_FOUND"
        });
    }
});

export default router;