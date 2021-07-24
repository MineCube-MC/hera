import { Command } from '../../Interfaces';
import { MessageEmbed } from 'discord.js';

export const command: Command = {
    name: 'mute',
    category: 'Moderation',
    aliases: [],
    description: 'Mutes a given user in the guild.',
	usage: '<@user> [reason]',
    run: async(client, message, args) => {
        if(!message.member.hasPermission('MANAGE_ROLES') || !message.member.hasPermission(["KICK_MEMBERS", "BAN_MEMBERS"]) || !message.guild.owner) return message.reply("You haven't the permission to use this command!");
	    if(!message.guild.me.hasPermission(["MANAGE_ROLES", "ADMINISTRATOR"])) return message.reply("I don't have permission to manage roles!");
	    let toMute = message.mentions.members.first();
	    if(!toMute) return message.reply("Supply a user to be muted!");
	    let reason = args.slice(1).join(" ");
	    if(!reason) reason = "No reason given";
	    let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
	    if(!muteRole) {
		    try {
		    	muteRole = await message.guild.roles.create({
		    		data: {
		    			name: "Muted",
		    			color: "#514f48",
		    			permissions: []
	    			}
			    });
		    } catch (e) {
			    console.log(e.stack);
		    }
	    }
	    message.guild.channels.cache.forEach((channel) => {
		    channel.updateOverwrite(muteRole, {
			    "SEND_MESSAGES": false,
		    	"ATTACH_FILES": false,
		    	"SEND_TTS_MESSAGES": false,
		    	"ADD_REACTIONS": false,
		    	"SPEAK": false,
		    	"STREAM": false
		    });
	    });
	    const muteConfirm = new MessageEmbed()
	    .setColor('#0099ff')
	    .setDescription(`✅ **${toMute.user.tag}** has been successfully muted!\nReason: __${reason}__`);
	    toMute.roles.add(muteRole.id).then(() => {
		    message.delete()
		    toMute.send(`You have been muted in **${message.guild.name}** for: **${reason}**`)
		message.channel.send(muteConfirm);
	    });
    }
}