import { Connection, Platform, DiscordConnectionOptions } from "./connection.js";

type DiscordMessage = {
    from: string,
    title: string,
    message: string
}

export default class DiscordConnection extends Connection {
    webhook: URL;
    opts: DiscordConnectionOptions;

    constructor(label: string, opts: DiscordConnectionOptions) {
        super(Platform.DISCORD, label);
        this.opts = opts;
        this.webhook = new URL(opts.webhook)
    }

    send(data: DiscordMessage) {
        fetch(this.webhook, {
            method: "POST",
            headers: {
                "content-type": "application/json"  
            },
            body: JSON.stringify({
                embeds: [
                    {
                        title: data.title,
                        author: {
                            name: data.from
                        },
                        description: data.message
                    }
                ]
            })
        })
    }
}