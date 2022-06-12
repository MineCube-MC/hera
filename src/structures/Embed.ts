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

export class MusicEmbed extends MessageEmbed {
    constructor() {
        super();
        this.setAuthor({ name: "Plenus Music System", iconURL: createdBy.icon });
        this.setColor("#16C36D");
    }
}