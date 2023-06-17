import { Connection, Platform, HTTPConnectionOptions } from "./connection.js";

export default class HTTPConnection extends Connection {
    constructor(opts: HTTPConnectionOptions) {
        super(Platform.HTTP, opts);
    }

    send(message: any) {
        console.log(message);
    }
}