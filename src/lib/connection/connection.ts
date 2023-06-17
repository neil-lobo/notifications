export enum Platform {
    TWITCH = "TWITCH",
    DISCORD = "DISCORD",
    HTTP = "HTTP"
}

export interface TwitchConnectionOptions {
    username: string,
    password: string,
    channels: string[]
}

export interface DiscordConnectionOptions {
    webhook: string
}

export enum HTTPConnectionMethod {
    GET = "GET",
    POST = "POST"
}

export interface HTTPConnectionOptions {
    method: HTTPConnectionMethod
    url: string
    payload: any
}

export type ConnectionOptions = TwitchConnectionOptions | DiscordConnectionOptions | HTTPConnectionOptions

export abstract class Connection {
    opts;
    platform;
    label;
    
    constructor(platform: Platform, label: string, opts: ConnectionOptions) {
        this.opts = opts;
        this.platform = platform;
        this.label = label;
    }

    abstract send(message: any): void;
}