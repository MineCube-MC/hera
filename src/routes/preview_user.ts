import express from "express";
import { WebSocket } from "ws";

const router = express.Router();

router.get("/", (req, res) => {
    // Create a connection to the local websocket
    const ws = new WebSocket("wss://ws.plenusbot.xyz:8443");
    const { previewKey } = req.query;
    ws.on("open", () => {
        // Send the request to the websocket
        ws.send(JSON.stringify({
            type: "alpha-1.2.6_10",
            previewKey: previewKey
        }));
    }).on("message", (message) => {
        // Send the response to the client
        res.status(200).json(JSON.parse(message.toString()));
        ws.close();
    }).on("error", (error) => {
        // Send the error to the client
        res.status(500).json({
            status: 500,
            error: error
        });
    }).on("close", () => {
        // Close the connection
        ws.close();
    });
});

export default router;