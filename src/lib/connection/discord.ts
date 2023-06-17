import { Connection, Platform, DiscordConnectionOptions } from "./connection.js";

export default class DiscordConnection extends Connection {
    constructor(opts: DiscordConnectionOptions) {
        super(Platform.DISCORD, opts);
    }

    send(message: any) {
        console.log(message);
    }
}