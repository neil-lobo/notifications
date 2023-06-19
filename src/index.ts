if (process.env.DOTENV) {
    (await import("dotenv")).config();
}

import config from "./lib/config.js";
import { Connection } from "./lib/connection/connection.js";
import HTTPConnection from "./lib/connection/http.js";
import { TwitchConnection, DiscordConnection } from "./lib/connections.js";
import express from "express";
import { routes } from "./routes/routes.js";

const app = express();
const PORT = process.env.PORT ?? 3000
const URL = process.env.URL ?? "http://localhost"
export const connections = new Map<string, Connection>();

for(let connection of config.connections) {
    switch(connection.platform) {
        case "TWITCH": {
            const conn = new TwitchConnection(connection.label, connection.options);
            connections.set(connection.label, conn);
            break;
        }
        case "DISCORD": {
            const conn = new DiscordConnection(connection.label, connection.options);
            connections.set(connection.label, conn)
            break;
        }
        case "HTTP": {
            const conn = new HTTPConnection(connection.label, connection.options);
            connections.set(connection.label, conn)
            break;
        }
    }
    console.log(`[CONNECTION] ${connection.label} | ${connection.platform}`);
}

app.use(routes)
app.listen(PORT, () => {
    console.log(`[REST] Listening on ${URL}:${PORT}`);
})