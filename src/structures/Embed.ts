import { MessageEmbed } from "discord.js";
import { createdBy } from "../../assets/locale.json";

export class ExtendedEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setColor('BLURPLE');
        this.setFooter({
            text: createdBy.text,
            iconURL: createdBy.icon
        });
    }
}