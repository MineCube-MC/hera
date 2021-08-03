import { GuildMember, TextChannel } from 'discord.js';
import { Event } from '../Interfaces';
import { welcomeChannelCollection as welcomeCollection } from '../Collections';

export const event: Event = {
    name: 'guildMemberAdd',
    run: async(client, member: GuildMember) => {
        const welcomeChannel = client.channels.cache.find(ch => ch.id === welcomeCollection.get(member.guild.id));
        if(!welcomeChannel) return;
        if (!((welcomeChannel): welcomeChannel is TextChannel => welcomeChannel.type === 'GUILD_TEXT')(welcomeChannel)) return;
        // Here type the code you need to send a custom generated image @LukeBTW
    }
}