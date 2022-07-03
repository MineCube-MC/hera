require("dotenv").config();

const ws = require("ws");
const socket = new ws.WebSocket("ws://ws.plenusbot.xyz");
const key = process.env.socketKey;

socket.onopen = () => {
    console.log("Socket connected");
    socket.send(JSON.stringify({
        type: "update",
        key: key
    }));
}

socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    if (data.message === "INVALID_KEY") {
        console.log("Invalid key");
        socket.close();
        process.exit(1);
    }
    if (data.message === "RESTARTING") {
        console.log("Successfully restarted the bot with the updated version");
        socket.close();
        process.exit(0);
    }
}