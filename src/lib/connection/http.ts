import { Connection, Platform, HTTPConnectionOptions } from "./connection.js";

export default class HTTPConnection extends Connection {
    constructor(label: string, opts: HTTPConnectionOptions) {
        super(Platform.HTTP, label, opts);
    }

    send(message: any) {
        console.log(message);
    }
}