import express from "express";
import numbersRouter from "./numbers";
import profileRouter from "./profile";
import guildRouter from "./guild";
import authRouter from "./auth";
import epicGamesRouter from "./epic_games";
import previewUserRouter from "./preview_user";

const router = express.Router();

router.get("/", (req, res) => {
    return res.redirect("https://documenter.getpostman.com/view/19883426/UVkvJYLp");
});

router.use("/numbers", numbersRouter);

router.use("/profile", profileRouter);

router.use("/guild", guildRouter);

router.use("/auth", authRouter);

router.use("/epic_games", epicGamesRouter);

router.use("/preview_user", previewUserRouter);

export default router;