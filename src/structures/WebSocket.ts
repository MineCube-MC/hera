import { ExtendedClient } from "./Client";
import ws from "ws";

export class WebSocket {
    static client: ExtendedClient;

    constructor(client: ExtendedClient) {
        WebSocket.client = client;
    }

    async start(port: string) {
        const server = new ws.Server({ port: parseInt(port) });

        server.on("listening", () => {
            console.log(`WebSocket running on port ${port}`);
        });

        server.on("connection", socket => {
            socket.on("message", message => {
                const response = JSON.parse(message.toString());
                if(response.key !== process.env.socketKey) {
                    socket.send(JSON.stringify({
                        message: "INVALID_KEY"
                    }));
                }
                if (response.type === "update") {
                    socket.send(JSON.stringify({ message: "CLIENT_RESTARTING" }));
                    socket.close();
                    WebSocket.client.destroy();
                    process.exit(0);
                }
            });
        });
    }
}