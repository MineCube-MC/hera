require("dotenv").config();

const ws = require("ws");
const socket = new ws.WebSocket("ws://ws.plenusbot.xyz:5944");
const key = process.env.socketKey;

socket.onopen = () => {
    console.log("Restarting the bot...");
    socket.send(JSON.stringify({
        type: "update",
        key: key
    }));
}

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.message === "INVALID_KEY") {
        console.log("Invalid key");
        socket.close();
        process.exit(1);
    }
    if (data.message === "CLIENT_RESTARTING") {
        console.log("Successfully restarted the bot with the updated version");
        socket.close();
        process.exit(0);
    }
}