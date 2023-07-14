declare global {
  namespace NodeJS {
    interface ProcessEnv {
      botToken: string
      clientId: string
      clientSecret: string
      guildId: string
      environment: "dev" | "prod" | "debug"
      lavalinkHost: string
    }
  }
}

export { }
