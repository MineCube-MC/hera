import { MessageEmbed, TextChannel } from 'discord.js';
import { Command } from '../../Interfaces';

export const command: Command = {
    name: 'personified',
    category: 'Fun',
    aliases: [],
    description: 'Personify everyone in a guild',
    run: async(client, message, args) => {
        if(!message.member.permissions.has('MENTION_EVERYONE')) return message.reply(`Sorry, but if this command would be allowed to everyone, it would be a mess 😂`);
        const personifyEmbed = new MessageEmbed()
            .setTitle('You got Personified!')
            .setColor(client.config.colors.secondary)
            .setDescription('You just got personified! Now join his gang.')
            .setImage('https://cdn.discordapp.com/avatars/859859863499964438/a4e0560492105dfe5b5249b34838d0fc.webp')
            .setFooter(`Personified by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }));
            const channels = message.guild.channels.cache.filter(c => c.type === 'text');
            Promise.all(channels.map(c => c.send(personifyEmbed)))
                .then(msgs => console.log(`${msgs.length} successfully sent.`))
                .catch(console.error);
    }
}