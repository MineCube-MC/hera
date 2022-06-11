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
        this.setFooter({ text: "Music offered by Spotify", iconURL: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/571e5943-4616-4654-bf99-10b3c98f8686/d98301o-426f05ca-8fe5-4636-9009-db9dd1fca1f3.png" });
        this.setColor("#16C36D");
    }
}