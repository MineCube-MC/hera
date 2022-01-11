declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            guildId: string;
            mongoUri: string;
            enviroment: "dev" | "prod" | "debug";
        }
    }
}

export {};
