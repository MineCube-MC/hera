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
        "721395864572264519"
    ],
    "partnership": {
        "channel": "924709092063318027",
        "mainGuild": "924159913024958505",
        "brandName": "Plenus Team"
    },
    "statusMessages": [
        "Amazing community",
        "Slash commands!",
        "Dashboard",
        "Invite me",
        "Made by Plenus Team"
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
        "redirectUri": process.env.REDIRECT_URI || "http://localhost:3000/discord/callback",
        "domain": process.env.DOMAIN || "http://localhost",
        "port": process.env.PORT || 3000,
        "license": process.env.DASH_LICENSE
    },
    "testMode": {
        "enabled": true,
        "guild": "924159913024958505"
    },
    "terminal": {
        "fancyTerminal": false,
        "verbose": false
    }
}