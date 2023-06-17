import { Connection, Platform, DiscordConnectionOptions } from "./connection.js";

type DiscordMessage = {
    from: string,
    title: string,
    message: string
}

export default class DiscordConnection extends Connection {
    webhooks: URL[];
    opts: DiscordConnectionOptions;

    constructor(label: string, opts: DiscordConnectionOptions) {
        super(Platform.DISCORD, label);
        this.opts = opts;
        this.webhooks = [];
        for(let webhook of opts.webhooks){
            this.webhooks.push(new URL(webhook));
        }
    }

    send(data: DiscordMessage) {
        this.broadcastNotification(data);
    }

    private broadcastNotification(data: DiscordMessage) {
        for(let webhook of this.webhooks) {
            fetch(webhook, {
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
}