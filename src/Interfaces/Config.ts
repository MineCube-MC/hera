import { ColorResolvable } from "discord.js";

export interface Config {
    token: string;
    clientSecret: string;
    clientId: string;
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
    dashboard: {
        redirectUri: string;
        domain: string;
        port: any;
        license: string;
    }
    testMode: {
        enabled: boolean;
        guild: string;
    };
    terminal: {
        fancyTerminal: boolean;
        verbose: boolean
    }
}