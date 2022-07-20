import { ExtendedClient } from "./Client";
import ws from "ws";
import https from "https";
import fs from "fs";
import alphaPreviewSchema from "../models/alphaPreviewSchema";
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
            socket.on("message", async (message) => {
                const response = JSON.parse(message.toString());
                if (response.type === "alpha-1.2.6_10") {
                    if (response.previewKey) {
                        const preview = await alphaPreviewSchema.findOne({ previewKey: response.previewKey });
                        if (preview) {
                            return socket.send(JSON.stringify({
                                message: "USER_PREVIEW_INFO",
                                username: preview.username,
                                userID: preview.userID
                            }));
                        } else {
                            return socket.send(JSON.stringify({
                                message: "USER_PREVIEW_NOT_FOUND"
                            }));
                        }
                    }
                    if (!response.accessToken) return socket.send(JSON.stringify({
                        message: "PREVIEW_ACCESS_TOKEN_MISSING"
                    }));
                    if (!response.userID) return socket.send(JSON.stringify({
                        message: "PREVIEW_USER_ID_MISSING"
                    }));

                    // Generate a preview key
                    let previewKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    // Store the preview key in the mongo schema
                    let alphaPreviewData;
                    try {
                        alphaPreviewData = await alphaPreviewSchema.findOne({ userID: response.userID });
                        if (!alphaPreviewData) {
                            if (!response.username) return socket.send(JSON.stringify({
                                message: "PREVIEW_USERNAME_MISSING"
                            }));
                            let profile = await alphaPreviewSchema.create({
                                userID: response.userID,
                                username: response.username,
                                previewKey: previewKey
                            });
                            profile.save();
                            alphaPreviewData = await alphaPreviewData.findOne({ userID: response.userID });
                            return socket.send(JSON.stringify({
                                message: "GENERATED_PREVIEW_KEY",
                                previewKey: previewKey
                            }));
                        } else {
                            if (!response.username) return socket.send(JSON.stringify({
                                message: "USER_PREVIEW_INFO",
                                previewKey: alphaPreviewData.previewKey,
                                username: alphaPreviewData.username
                            }));
                            alphaPreviewSchema.findOneAndUpdate({
                                userID: response.userID
                            }, {
                                $set: {
                                    username: response.username
                                }
                            });
                            return socket.send(JSON.stringify({
                                message: "GENERATED_PREVIEW_KEY",
                                username: response.username,
                                previewKey: alphaPreviewData.previewKey
                            }));
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }
                // Queries that everyone can use
                if (response.type === "numbers") {
                    socket.send(JSON.stringify({
                        message: "RETURNED_NUMBERS",
                        data: {
                            users: WebSocket.client.users.cache.size,
                            guilds: WebSocket.client.guilds.cache.size,
                            channels: WebSocket.client.channels.cache.size,
                            commands: WebSocket.client.commands.size,
                            uptime: WebSocket.client.uptime,
                            ping: WebSocket.client.ws.ping
                        }
                    }));
                    return true;
                }
                // Queries that are protected by a secret key
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