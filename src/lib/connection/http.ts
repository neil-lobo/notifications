import { Connection, Platform, HTTPConnectionOptions, MessageOptions } from "./connection.js";

export default class HTTPConnection extends Connection {
    opts: HTTPConnectionOptions;

    constructor(label: string, opts: HTTPConnectionOptions) {
        super(Platform.HTTP, label);
        this.opts = opts;
    }

    send(message: MessageOptions) {
        console.log(message);
    }
}