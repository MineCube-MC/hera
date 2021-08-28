import { ColorResolvable } from "discord.js";

export interface Config {
    token: string;
    mongoURI: string;
    owners: string[];
    partnership: {
        channel: string;
        mainGuild: string;
        brandName: string;
    };
    statusMessages: string[];
    colors: {
        main: ColorResolvable;
        secondary: ColorResolvable;
        positive: ColorResolvable;
        negative: ColorResolvable;
        admin: ColorResolvable;
        fun: ColorResolvable;
    };
    testMode: {
        enabled: boolean;
        guild: string;
    };
    terminal: {
        fancyTerminal: boolean;
        verbose: boolean
    }
}