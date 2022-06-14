declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            clientId: string;
            clientSecret: string;
            guildId: string;
            mongoUri: string;
            enviroment: "dev" | "prod" | "debug";
            port: string;
        }
    }
}

export {};
