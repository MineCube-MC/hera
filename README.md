<img src="assets/logo_nobg.png" alt="Hera Logo" align="right" height="256px">
<div align="center">
  <h1>Hera</h1>
  <h3>A new entertaining Discord Bot made in TypeScript</h3>

![Repository Size](https://img.shields.io/github/repo-size/apexiedev/hera)
![Issues](https://img.shields.io/github/issues/apexiedev/hera)
![Pull Requests](https://img.shields.io/github/issues-pr/apexiedev/hera)

</div>

---

## Online in:

- [Apexie's World](https://dsc.gg/apexie)
- Many other servers

---

## Installation and launching:

### Docker

The Docker installation is pretty straight-forward. You can look at our [**docker-compose.yml**](docker-compose.yml) file to see an example of deployment of the bot. After doing your changes to the file, write the following command in the console (assuming you have Docker and the Docker Compose plugin installed):

```console
docker compose up -d
```

### Manual

- Install **[bun](https://bun.sh/)** on your machine.
- Clone the repository on your machine.
- Open your console in the cloned repository.
- To complete the installation, write the following command in the console:

```console
bun install
```

- After installation, you will need to **[configure the bot](#bot-config)**.
- To start the bot, write the following command in the console:

```console
bun run start
```

---

## Bot config:

**DISCLAIMER: We won't help you rebranding the bot for any other server. If you really want to do that, then you need to figure it out yourself.**

- Create an app on the **[Discord Developer Portal](https://discord.com/developers/)**.
- Go to the **Bot** tab, create a bot and copy its token.
- Create a file named **.env** or rename the **.env.example** file to **.env**.
- Open the **.env** file using any text editor.
- This file contains general bot settings in this format:

|  Field name  |     Example value      |                                 Description                                 |
| :----------: | :--------------------: | :-------------------------------------------------------------------------: |
|   botToken   |          "-"           |   The token you copied from the Developer Portal, used to login the bot.    |
|   clientId   |          "-"           |   The client ID you copied from the Developer Portal, used for the auth.    |
| clientSecret |          "-"           | The client secret you copied from the Developer Portal, also used for auth. |
|   guildId    |  "924159913024958505"  |              This is the guild used in a developer environment              |
| environment  | "dev", "debug", "prod" |       Sets the environment of the bot. Useful for guild only commands       |
| lavalinkHost |          "-"           |          The Lavalink host used for playing music in voice channels         |
