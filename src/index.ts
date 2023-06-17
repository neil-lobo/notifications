import config from "./lib/config.js";
import { Connection } from "./lib/connection/connection.js";
import HTTPConnection from "./lib/connection/http.js";
import { TwitchConnection, DiscordConnection } from "./lib/connections.js";

const connections: Connection[] = [];

for(let connection of config.connections) {
    switch(connection.platform) {
        case "TWITCH": {
            const conn = new TwitchConnection(connection.options);
            connections.push(conn);
            break;
        }
        case "DISCORD": {
            const conn = new DiscordConnection(connection.options);
            connections.push(conn)
            break;
        }
        case "HTTP": {
            const conn = new HTTPConnection(connection.options);
            connections.push(conn)
            break;
        }
    }
    console.log(`[CONNECTION] ${connection.label} | ${connection.platform}`);
}