import express from "express";
import { API } from "../structures/API";

const router = express.Router();

router.get("/", (req, res) => {
    let users: number = 0;
    API.client.guilds.cache.forEach((guild) => {
        users = users + guild.members.cache.size;
    });
    res.status(200).json({
        status: 200,
        servers: API.client.guilds.cache.size,
        users: users
    });
});

export default router;