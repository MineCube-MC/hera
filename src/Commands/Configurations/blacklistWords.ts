import { Command } from '../../Interfaces';
import { blacklistedWordsSchema as Schema } from '../../Models/blacklistedWords';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'blacklist',
    description: 'Manage the blacklist of the guild',
    options: [
        {
            name: 'add',
            description: 'Add a word to the blacklist',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'word',
                    description: 'The word you want to add into the blacklist',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Remove a word from the blacklist',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'word',
                    description: 'The word you want to add into the blacklist',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'display',
            description: 'Sends the blacklist as an embed',
            type: 'SUB_COMMAND'
        }
    ],
    async execute(interaction, client) {
        if(!interaction.guild.members.cache.get(interaction.user.id).permissions.has('ADMINISTRATOR')) return interaction.reply({ content: `You don't have enough permissions to use this command.`, ephemeral: true });

        const query = interaction.options.getSubcommand(true);

        if(query === 'add') {
            const word = interaction.options.getString("word").toLowerCase();
            if(!word) return interaction.reply({ content: 'You need to specify a word to add.', ephemeral: true });

            await Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(data) {
                    if((data.Words as string[]).includes(word)) return interaction.reply({ content: 'The word is already added into the blacklist.', ephemeral: true });

                    (data.Words as string[]).push(word);
                    data.save();
                } else {
                    new Schema({
                        Guild: interaction.guild.id,
                        Words: [ word ]
                    }).save();
                }
                interaction.reply({ content: `The word \`${word}\` has been added into the blacklist.`, ephemeral: true });
            }).clone();
        } else if(query === 'remove') {
            const word = interaction.options.getString("word").toLowerCase();
            if(!word) return interaction.reply({ content: 'You need to specify a word to remove.', ephemeral: true });

            await Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.reply({ content: `There isn't any data to delete`, ephemeral: true });

                if(!(data.Words as string[]).includes(word)) return interaction.reply({ content: `The word doesn't exist in the blacklist.`, ephemeral: true });

                const filtered = (data.Words as string[]).filter((target) => target !== word);

                await Schema.findOneAndUpdate({ Guild: interaction.guild.id }, {
                    Guild: interaction.guild.id,
                    Words: filtered
                }).clone();

                interaction.reply({ content: `The word \`${word}\` has been removed from the blacklist.`, ephemeral: true });
            }).clone();
        } else if(query === 'display') {
            await Schema.findOne({ Guild: interaction.guild.id }, async(err, data) => {
                if(!data) return interaction.reply(`There's no blacklisted word in this server.`);
                interaction.reply({ embeds: [
                    new MessageEmbed()
                    .setTitle('Blacklisted words')
                    .setColor(client.config.colors.admin)
                    .setDescription((data.Words as string[]).join(', '))
                    .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
                    .setTimestamp()
                ] });
            }).clone();
        }
    }
}