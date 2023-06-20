if (process.env.DOTENV) {
    (await import("dotenv")).config();
}

import config from "./lib/config.js";
import { Connection } from "./lib/connection/connection.js";
import { createConnection } from "./lib/connections.js";
import express from "express";
import { routes } from "./routes/routes.js";
import { find } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT ?? 3000;
const URL = process.env.URL ?? "http://localhost";
export const connections = new Map<string, Connection>();
let loadedConnections: any = [];

if (config.db) {
    loadedConnections = await find({});
    console.log("[DB] Loaded connections");
} else {
    loadedConnections = config.connections;
}

for (const connection of loadedConnections) {
    const conn = createConnection(
        connection.platform,
        connection.label,
        connection.options
    );
    connections.set(connection.label, conn);
    console.log(
        `[CREATE CONNECTION] ${connection.label} | ${connection.platform}`
    );
}

app.use(routes);
app.listen(PORT, () => {
    console.log(`[REST] Listening on ${URL}:${PORT}`);
});
