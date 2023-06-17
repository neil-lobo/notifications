import { Connection, Platform, TwitchConnectionOptions } from "./connection.js";
import { ChatClient } from "@kararty/dank-twitch-irc";

export default class TwitchConnection extends Connection {
    client: ChatClient;
    channels: string[];

    constructor(opts: TwitchConnectionOptions) {
        super(Platform.TWITCH, opts);
        this.client = this.initializeClient(opts);
        this.channels = opts.channels;
    }

    private initializeClient(opts: TwitchConnectionOptions): ChatClient {
        const client = new ChatClient({
            username: opts.username,
            password: opts.password,
        })

        client.on("ready", () => {
            console.log(`[IRC] Logged in as ${opts.username}`);
            client.joinAll(opts.channels)
        })

        client.on("JOIN", msg => {
            console.log(`[JOIN] #${msg.channelName}`);
        })

        client.connect();
        return client
    }

    send(message: any) {
        this.broadcastNotification(message);
    }

    private broadcastNotification(message: string) {
        for(let channel of this.channels) {
            this.client.say(channel, message);
        }
    }
}