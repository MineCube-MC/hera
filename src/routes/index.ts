import express from "express";
import numbersRouter from "./numbers";
import profileRouter from "./profile";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendStatus(200);
});

router.use("/numbers", numbersRouter);

router.use("/profile", profileRouter);

export default router;