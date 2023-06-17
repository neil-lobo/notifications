import config from "./lib/config.js";
import { Connection } from "./lib/connection/connection.js";
import HTTPConnection from "./lib/connection/http.js";
import { TwitchConnection, DiscordConnection } from "./lib/connections.js";

const connections = new Map<string, Connection>();

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