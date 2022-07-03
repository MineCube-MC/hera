import { ExtendedClient } from "./Client";
import ws from "ws";
import https from "https";
import fs from "fs";

export class WebSocket {
    static client: ExtendedClient;

    constructor(client: ExtendedClient) {
        WebSocket.client = client;
    }

    async start(port: string) {
        let privateKey = fs.readFileSync("certs/plenusbot.xyz.key", 'utf8');
        let certificate = fs.readFileSync("certs/plenusbot.xyz.pem", 'utf8');
        let credentials = {
            key: privateKey,
            cert: certificate
        };
        const httpsServer = https.createServer(credentials);
        httpsServer.listen(port);

        const server = new ws.Server({ server: httpsServer });

        server.on("listening", () => {
            console.log(`WebSocket running on port ${port}`);
        });

        server.on("connection", socket => {
            socket.on("message", message => {
                const response = JSON.parse(message.toString());
                if (response.key !== process.env.socketKey) {
                    socket.send(JSON.stringify({
                        message: "INVALID_KEY"
                    }));
                    return true;
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