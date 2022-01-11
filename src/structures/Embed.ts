import { MessageEmbed } from "discord.js";

export class ExtendedEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor('BLURPLE');
    }
}