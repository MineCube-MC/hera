<img src="/assets/logo.png" alt="CompliBot" align="right" height="256px">
<div align="center">
  <h1>Plenus</h1>
  <h3>A new multi-purpose Discord Bot made in TypeScript</h3>

![Repository Size](https://img.shields.io/github/repo-size/ApexieCommunity/Plenus)
![Issues](https://img.shields.io/github/issues/ApexieCommunity/Plenus)
![Pull Requests](https://img.shields.io/github/issues-pr/ApexieCommunity/Plenus)
</div>

___
### Online on:
- [Apexie's World](https://discord.gg/sN9YRQbBv7)
- [Plenus Support](https://discord.gg/Tqtwtgh)
- Many other servers

___
### Installation and launching:
- Install **[Node.js](https://nodejs.org/)** on your machine. **Version 16.6 or higher is required!**
- Clone the repository on your machine.
- Open your console in the cloned repository.
- To complete the installation, write the following command in the console:
```console
npm install
```
- After installation, you will need to **[configure the bot](#bot-config)**.
- To start the bot, write the following command in the console:
```console
node .
```

___
### Bot config:

**DISCLAIMER: We won't help you rebranding the bot for any other server. If you really want to do that, then you need to figure it out yourself.**

- Create an app on the **[Discord Developer Portal](https://discord.com/developers/)**.
- Go to the **Bot** tab, create a bot and copy its token.
- Create a file named **.env** or rename the **.env.example** file to **.env**.
- Open the **.env** file using any text editor.
- This file contains general bot settings in this format:

|       Field name        |               Example value                |                                Description                                |
|:-----------------------:|:------------------------------------------:|:-------------------------------------------------------------------------:|
|         botToken        |                    "-"                     |  The token you copied from the Developer Portal, used to login the bot.   |
|         guildId         |            "924159913024958505"            |              This is the guild used in a developer environment            |
|        mongoUri         |     "mongodb://127.0.0.1:27017/plenus"     |                The MongoDB server URI, used for the database              |
|       environment       |           "dev", "debug", "prod"           |      Sets the environment of the bot. Useful for guild only commands      |