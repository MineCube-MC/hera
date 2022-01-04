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
        const Schema = await moderationLogsSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) return "";
            return data.Channel;
        }).clone();
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
        const Schema = await welcomeChannelSchema.findOne({ Guild: guild.id }, async(err, data) => {
            if(!data) return "";
            return data.Channel;
        }).clone();
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

    public static getRanking(guild: Guild): any {
        rankingSchema.findOne({ Guild: guild.id }, async (err, data) => {
            if(!data) {
                new rankingSchema({
                    Guild: guild.id,
                    Enabled: true
                }).save();
                return true;
            } else {
                return data.Enabled;
            }
        }).clone();
    }

}