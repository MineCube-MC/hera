import { Command } from '../../Interfaces';
import Nuggies from 'nuggies';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'apexieroles',
    category: 'Private',
    aliases: [],
    description: `Adds all the "Apexie's World" reaction roles to the specified chat`,
    run: async(client, message, args) => {
        const deviceOptions = new Nuggies.dropdownroles().addrole({
            label: 'PC',
            role: '869888930386952203',
            emoji: '💻'
        }).addrole({
            label: 'Mobile',
            role: '869888955624083506',
            emoji: '📱'
        }).addrole({
            label: 'Console',
            role: '869888977925189632',
            emoji: '🎮'
        });

        const deviceEmbed = new MessageEmbed()
            .setColor(client.config.colors.main)
            .setDescription('Select a role from the dropdown to add/remove it on/from your profile.');

        Nuggies.dropdownroles.create({
            message: message,
            role: deviceOptions,
            content: deviceEmbed,
            channelID: message.channel.id
        });
    }
}