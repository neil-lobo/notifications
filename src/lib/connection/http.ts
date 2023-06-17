import { Connection, Platform, HTTPConnectionOptions } from "./connection.js";

export default class HTTPConnection extends Connection {
    opts: HTTPConnectionOptions;

    constructor(label: string, opts: HTTPConnectionOptions) {
        super(Platform.HTTP, label);
        this.opts = opts;
    }

    send(message: any) {
        console.log(message);
    }
}