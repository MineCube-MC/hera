import express, { Request, Response } from "express";
import { API } from "../structures/API";
import { Country, getGames } from "epic-free-games/dist";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    const { country } = req.query;
    if(country) {
        getGames(country as Country, true).then(data => {
            res.json(data);
        })
    } else {
        res.sendStatus(400);
    }
});

export default router;