import { Command } from '../../Interfaces';
import { blacklistedWordsSchema as Schema } from '../../Models/blacklistedWords';
import { blacklistedWordsCollection as Collection } from '../../Collections';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'blacklist',
    type: 'bot',
    category: 'Configurations',
    description: 'Change the blacklist options',
    aliases: ['bl'],
    usage: '<add|remove|display|collection> [word]',
    run: async(client, args, message) => {
        if(!message.member.permissions.has('ADMINISTRATOR')) return message.reply(`You don't have enough permissions to use this command.`);

        const query = args[0]?.toLowerCase();

        if(query === 'add') {
            const word = args[1].toLowerCase();
            if(!word) return message.reply('You need to specify a word to add.');

            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(data) {
                    if((data.Words as string[]).includes(word)) return message.reply('The word is already added into the blacklist.');

                    (data.Words as string[]).push(word);
                    data.save();
                    Collection.get(message.guild.id).push(word);
                } else {
                    new Schema({
                        Guild: message.guild.id,
                        Words: word
                    }).save();
                    Collection.set(message.guild.id, [ word ]);
                }
                message.reply(`The word \`${word}\` has been added into the blacklist.`);
            });
        } else if(query === 'remove') {
            const word = args[1].toLowerCase();
            if(!word) return message.reply('You need to specify a word to remove.');

            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) return message.reply(`There isn't any data to delete`);

                if(!(data.Words as string[]).includes(word)) return message.reply(`The word doesn't exist in the blacklist.`);

                const filtered = (data.Words as string[]).filter((target) => target !== word);

                await Schema.findOneAndUpdate({ Guild: message.guild.id }, {
                    Guild: message.guild.id,
                    Words: filtered
                });
                Collection.get(message.guild.id).filter((target) => target !== word);

                message.reply(`The word \`${word}\` has been removed from the blacklist.`);
            });
        } else if(query === 'display') {
            Schema.findOne({ Guild: message.guild.id }, async(err, data) => {
                if(!data) return message.reply(`There's no blacklisted word in this server.`);
                message.reply({ embeds: [
                    new MessageEmbed()
                    .setTitle('Blacklisted words')
                    .setDescription((data.Words as string[]).join(', '))
                    .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                ] });
            });
        } else if(query === 'collection') {
            const getCollection = Collection.get(message.guild.id);
            if(getCollection) return message.reply(`\`\`\`js\n${getCollection}\n\`\`\``);
        } else message.reply(`These are the available options: \`add\`, \`remove\`, \`display\`, \`collection\``);
    }
}