import { Command } from '../../Interfaces';
import { blacklistedWordsSchema as Schema } from '../../Models/blacklistedWords';
import { blacklistedWordsCollection as Collection } from '../../Collections';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'blacklist',
    type: 'bot',
    category: 'Configurations',
    description: 'Change the blacklist options',
    usage: '<add|remove|display|collection> [word]',
    run: async(client, args, interaction) => {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const query = args[0]?.toLowerCase();

        if(query === 'add') {
            const word = args[1].toLowerCase();
            if(!word) return interaction.reply({ content: 'You need to specify a word to add.', ephemeral: true });

            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    if((data.Words as string[]).includes(word)) return interaction.reply({ content: 'The word is already added into the blacklist.', ephemeral: true });

                    (data.Words as string[]).push(word);
                    data.save();
                    Collection.get(interaction.guild.id).push(word);
                } else {
                    new Schema({
                        Guild: interaction.guild.id,
                        Words: word
                    }).save();
                    Collection.set(interaction.guild.id, [ word ]);
                }
                interaction.reply({ content: `The word \`${word}\` has been added into the blacklist.`, ephemeral: true });
            });
        } else if(query === 'remove') {
            const word = args[1].toLowerCase();
            if(!word) return interaction.reply({ content: 'You need to specify a word to remove.', ephemeral: true });

            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.reply({ content: `There isn't any data to delete`, ephemeral: true });

                if(!(data.Words as string[]).includes(word)) return interaction.reply({ content: `The word doesn't exist in the blacklist.`, ephemeral: true });

                const filtered = (data.Words as string[]).filter((target) => target !== word);

                await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, {
                    Guild: interaction.guild.id,
                    Words: filtered
                });
                Collection.get(interaction.guild.id).filter((target) => target !== word);

                interaction.reply({ content: `The word \`${word}\` has been removed from the blacklist.`, ephemeral: true });
            });
        } else if(query === 'display') {
            Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.reply(`There's no blacklisted word in this server.`);
                interaction.reply({ embeds: [
                    new MessageEmbed()
                    .setTitle('Blacklisted words')
                    .setColor(client.config.colors.admin)
                    .setDescription((data.Words as string[]).join(', '))
                    .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                ] });
            });
        } else if(query === 'collection') {
            const getCollection = Collection.get(interaction.guild.id);
            if(getCollection) return interaction.reply(`\`\`\`\n${getCollection}\n\`\`\``);
        } else interaction.reply(`These are the available options: \`add\`, \`remove\`, \`display\`, \`collection\``);
    }
}