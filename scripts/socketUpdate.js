const ws = require("ws");

const socket = new ws.WebSocket("ws://api.plenusbot.xyz:5944");
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
    if (data.message === "RESTARTING") {
        console.log("Successfully restarted the bot with the updated version");
        socket.close();
        process.exit(0);
    }
}