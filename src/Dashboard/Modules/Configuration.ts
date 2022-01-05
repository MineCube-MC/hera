import { Guild, GuildTextBasedChannel, TextChannel } from "discord.js";
import { moderationLogsSchema } from "../../Models/moderationLogs";
import { autoRolesSchema } from "../../Models/autoRoles";
import { welcomeChannelSchema } from "../../Models/welcomeChannel";
import { rankingSchema } from "../../Models/ranking";

export class Configuration {

    public static async getChannels(guild: Guild) {
        let arrayOfChannels: any[] = guild.channels.cache.map(channel => channel.id);
        return arrayOfChannels;
    }

    public static async changeLogChannel(guild: Guild, channel: GuildTextBasedChannel) {
        await moderationLogsSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) {
                new moderationLogsSchema({
                    Guild: guild.id,
                    Channel: channel.id
                }).save();
            } else {
                data.Channel = channel.id;
                data.save();
            }
        }).clone();
    }

    public static async getLogChannel(guild: Guild) {
        let channel: string;
        await moderationLogsSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) channel = "";
            channel = data.Channel;
        }).clone();
        return channel;
    }

    public static async changeWelcomeChannel(guild: Guild, channel: TextChannel) {
        await welcomeChannelSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) {
                new welcomeChannelSchema({
                    Guild: guild.id,
                    Channel: channel.id
                }).save();
            } else {
                data.Channel = channel.id;
                data.save();
            }
        }).clone();
    }

    public static async getWelcomeChannel(guild: Guild) {
        let channel: string;
        await welcomeChannelSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) channel = "";
            channel = data.Channel;
        }).clone();
        return channel;
    }

    public static async setAutoRoles(guild: Guild, rolesArray: string[]) {
        await autoRolesSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(data) {
                (data.AutoRoles as string[]) = rolesArray;
                data.save();
            } else {
                new autoRolesSchema({
                    Guild: guild.id,
                    AutoRoles: rolesArray
                }).save();
            }
        }).clone();
    }

    public static async getAutoRoles(guild: Guild) {
        let array: string[];
        await autoRolesSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) array = [];
            array = data.AutoRoles;
        }).clone();
        return array;
    }

    public static async setRanking(guild: Guild, enabled: boolean) {
        await rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: enabled
                }).save();
            } else {
                data.Enabled = enabled;
                data.save();
            }
        }).clone();
    }

    public static async getRanking(guild: Guild): Promise<any> {
        let ranking: boolean;
        await rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: true
                }).save();
                ranking = true;
            } else {
                ranking = data.Enabled;
            }
        }).clone();
        return ranking;
    }

}