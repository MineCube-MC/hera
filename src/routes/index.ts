import express from "express";
import numbersRouter from "./numbers";
import profileRouter from "./profile";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendStatus(200).json({
        status: 200,
        message: "Congratulations! You have access to the API, try one of the routes available.",
        availableRoutes: [
            "numbers",
            "profile"
        ]
    });
});

router.use("/numbers", numbersRouter);

router.use("/profile", profileRouter);

export default router;