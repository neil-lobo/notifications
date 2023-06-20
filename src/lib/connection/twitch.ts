import {
    Connection,
    MessageOptions,
    Platform,
    TwitchConnectionOptions,
} from "./connection.js";
import {
    AlternateMessageModifier,
    ChatClient,
    SlowModeRateLimiter,
} from "@kararty/dank-twitch-irc";

export default class TwitchConnection extends Connection {
    client: ChatClient;
    channels: string[];
    opts: TwitchConnectionOptions;

    constructor(label: string, opts: TwitchConnectionOptions) {
        super(Platform.TWITCH, label);
        this.opts = opts;
        this.client = this.initializeClient(opts);
        this.channels = opts.channels;
    }

    private initializeClient(opts: TwitchConnectionOptions): ChatClient {
        const client = new ChatClient({
            username: opts.username,
            password: opts.password,
        });

        client.use(new AlternateMessageModifier(client));
        client.use(new SlowModeRateLimiter(client));

        client.on("ready", () => {
            console.log(`[IRC] Logged in as ${opts.username}`);
            client.joinAll(opts.channels);
        });

        client.on("JOIN", (msg) => {
            console.log(`[JOIN] #${msg.channelName}`);
        });

        client.connect();
        return client;
    }

    send(message: MessageOptions) {
        this.broadcastNotification(message);
    }

    private broadcastNotification(message: MessageOptions) {
        const msg =
            (message.from ? `[ ${message.from} ] ` : "") +
            (message.title ? `${message.title} | ` : "") +
            message.message;
        for (const channel of this.channels) {
            if (message.highlighted) {
                this.client.me(channel, msg);
            } else {
                this.client.say(channel, msg);
            }
        }
    }
}
