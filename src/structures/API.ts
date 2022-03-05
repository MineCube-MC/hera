import express from "express";
import routes from "../routes";
import { ExtendedClient } from "./Client";

export class API {
    static client: ExtendedClient;

    constructor(client: ExtendedClient) {
        API.client = client;
    }

    async start(port: string) {
        const app = express();

        app.use("/", routes);

        app.listen(port, () => {
            console.log(`API running on port ${port}`);
        });
    }
}