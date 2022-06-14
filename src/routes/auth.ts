import express, { Request, Response } from "express";
import axios from "axios";
import url from "url";
import { API } from "../structures/API";

const router = express.Router();

router.get("/discord/redirect", async (req: Request, res: Response) => {
    const { code } = req.query;
    if (code) {
        try {
            const formData = new url.URLSearchParams({
                client_id: process.env.clientId,
                client_secret: process.env.clientSecret,
                grant_type: "authorization_code",
                code: code.toString(),
                redirect_uri: `https://api.plenusbot.xyz/auth/discord/redirect`
            });
            const response = await axios.post(
                "https://discord.com/api/v10/oauth2/token",
                formData.toString(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
            if(process.env.environment === "dev" || process.env.environment === "debug") {
                res.redirect(`https://localhost:53134?access_token=${response.data.access_token}`);
            } else {
                res.redirect(`https://apexie.eu?access_token=${response.data.access_token}`);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    } else {
        res.sendStatus(400);
    }
});

export default router;