declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string;
            clientId: string;
            clientSecret: string;
            guildId: string;
            mongoUri: string;
            environment: "dev" | "prod" | "debug";
            port: string;
            socketPort: string;
            socketKey: string;
        }
    }
}

export {};