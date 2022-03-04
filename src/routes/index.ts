import express from "express";
import numbersRouter from "./numbers";

const router = express.Router();

router.get("/", (req, res) => {
    res.sendStatus(200);
});

router.use("/numbers", numbersRouter);

export default router;