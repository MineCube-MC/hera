import express from "express";
import numbersRouter from "./numbers";
import profileRouter from "./profile";
import guildRouter from "./guild";

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        status: 200,
        message: "Congratulations! You have access to the API, try one of the routes available.",
        availableRoutes: [
            "numbers",
            "profile",
            "guild"
        ]
    });
});

router.use("/numbers", numbersRouter);

router.use("/profile", profileRouter);

router.use("/guild", guildRouter);

export default router;