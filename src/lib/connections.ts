import TwitchConnection from "./connection/twitch.js";
import DiscordConnection from "./connection/discord.js";
import HTTPConnection from "./connection/http.js";
import { Connection, Platform } from "./connection/connection.js";

export function createConnection(platform: Platform, label: string, options: any): Connection {
    switch(platform) {
        case Platform.TWITCH: {
            return new TwitchConnection(label, options);
        }
        case Platform.DISCORD: {
            return new DiscordConnection(label, options);
        }
        case Platform.HTTP: {
            return new HTTPConnection(label, options);
        }
    }
}

export { TwitchConnection, DiscordConnection, HTTPConnection };