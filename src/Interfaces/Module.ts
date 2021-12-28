import { Guild } from "discord.js";
import ExtendedClient from "../Client";

export interface Module {
    getState(guild: Guild, client?: ExtendedClient): boolean;
    enable(guild: Guild, client?: ExtendedClient);
    disable(guild: Guild, client?: ExtendedClient);
    getValue(guild: Guild, client?: ExtendedClient);
    setValue(guild: Guild, client?: ExtendedClient);
}