import { EmbedBuilder } from "discord.js";
import locale from "../../assets/locale.json";

export class ExtendedEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setColor("#ECAF0D");
    this.setFooter({
      text: locale.createdBy.text,
      iconURL: locale.createdBy.icon,
    });
  }
}

export class MusicEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setAuthor({ name: "Hera Music System", iconURL: locale.createdBy.icon });
    this.setColor("#16C36D");
  }
}
