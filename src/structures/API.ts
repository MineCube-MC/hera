import express from "express";
import routes from "../routes";
import { ExtendedClient } from "./Client";
import cors from "cors";
export class API {
    static client: ExtendedClient;

    constructor(client: ExtendedClient) {
        API.client = client;
    }

    async start(port: string) {

        const app = express();

        app.use("/", routes);

        app.use(cors({
            origin: '*',
            methods: 'GET,POST,PUT,DELETE',
            allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept, Content-Length, Cache-Control, Pragma, Expires, If-Modified-Since, Last-Modified, Date, Connection, Keep-Alive, User-Agent, Accept-Encoding, Accept-Language, X-CSRF-Token, X-Requested-With, X-XSRF-TOKEN, Origin, Accept, Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Access-Control-Expose-Headers, Access-Control-Max-Age, Access-Control-Allow-Origin'
        }));

        app.listen(port, () => {
            console.log(`API running on port ${port}`);
        });
    }
}