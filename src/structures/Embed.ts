import { EmbedBuilder } from "discord.js";
import { createdBy } from "../../assets/locale.json";

export class ExtendedEmbed extends EmbedBuilder {
    constructor() {
        super();
        this.setColor("Blurple");
        this.setFooter({
            text: createdBy.text,
            iconURL: createdBy.icon
        });
    }
}

export class MusicEmbed extends EmbedBuilder {
    constructor() {
        super();
        this.setAuthor({ name: "Plenus Music System", iconURL: createdBy.icon });
        this.setColor("#16C36D");
    }
}