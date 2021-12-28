import { Config } from "./src/Interfaces";
import dotenv from 'dotenv';

dotenv.config();

export const config: Config = {
    "token": process.env.TOKEN,
    "clientSecret": process.env.SECRET,
    "clientId": process.env.CLIENT_ID,
    "mongoURI": process.env.MONGO_URI,
    "owners": [
        "480987124405895168",
        "832967911206944788",
        "503533501099016203",
        "467338019830104064",
        "721395864572264519"
    ],
    "partnership": {
        "channel": "877649597533671434",
        "mainGuild": "736977303539810365",
        "brandName": "Apexie's World"
    },
    "statusMessages": [
        "Ready to help you",
        "Just a simple bot",
        "Made with love by Apexie",
        "Use our slash commands",
        "Plenus & Knuckles"
    ],
    "colors": {
        "main": "#23abeb",
        "secondary": "#ffffff",
        "positive": "#58eb34",
        "negative": "#fc3a3a",
        "admin": "#7945f5",
        "fun": "#3eedf0"
    },
    "dashboard": {
        "redirectUri": "https://plenus.apexiecommunity.cf/discord/callback",
        "domain": "http://plenus.apexiecommunity.cf",
        "port": process.env.PORT || 3000
    },
    "testMode": {
        "enabled": false,
        "guild": "924159913024958505"
    },
    "terminal": {
        "fancyTerminal": false,
        "verbose": false
    }
}