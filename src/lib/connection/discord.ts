import { Connection, Platform, DiscordConnectionOptions } from "./connection.js";

export default class DiscordConnection extends Connection {
    webhook: URL;
    opts: DiscordConnectionOptions;

    constructor(label: string, opts: DiscordConnectionOptions) {
        super(Platform.DISCORD, label);
        this.opts = opts;
        this.webhook = new URL(opts.webhook)
    }

    async send(message: any) {
        fetch(this.webhook, {
            method: "POST",
            headers: {
                "content-type": "application/json"  
            },
            body: JSON.stringify({
                content: message
            })
        })
    }
}