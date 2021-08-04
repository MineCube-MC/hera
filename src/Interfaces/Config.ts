import { ColorResolvable } from "discord.js";

export interface Config {
    token: string;
    mongoURI: string;
    prefix: string;
    owners: string[];
    colors: {
        main: ColorResolvable;
        secondary: ColorResolvable;
        positive: ColorResolvable;
        negative: ColorResolvable;
        admin: ColorResolvable;
        fun: ColorResolvable;
    }
}