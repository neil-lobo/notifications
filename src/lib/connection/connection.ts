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
    webhooks: string[]
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

export interface MessageOptions {
    title?: string,
    message: string,
    from?: string
    highlighted?: boolean
}

export abstract class Connection {
    platform: Platform;
    label: string;
    
    constructor(platform: Platform, label: string) {
        this.platform = platform;
        this.label = label;
    }

    abstract send(message: MessageOptions): void;
}