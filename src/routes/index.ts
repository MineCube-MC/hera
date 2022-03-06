import express from "express";
import numbersRouter from "./numbers";
import profileRouter from "./profile";
import guildRouter from "./guild";

const router = express.Router();

router.get("/", (req, res) => {
    return res.redirect("https://documenter.getpostman.com/view/19883426/UVkvJYLp");
});

router.use("/numbers", numbersRouter);

router.use("/profile", profileRouter);

router.use("/guild", guildRouter);

export default router;