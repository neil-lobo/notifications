import {
    Connection,
    Platform,
    HTTPConnectionOptions,
    MessageOptions,
    HTTPConnectionMethod,
} from "./connection.js";

export default class HTTPConnection extends Connection {
    method: HTTPConnectionMethod;
    url: URL;
    headers: any;
    body: any;
    opts: HTTPConnectionOptions;

    constructor(label: string, opts: HTTPConnectionOptions) {
        super(Platform.HTTP, label);
        this.opts = opts;
        this.method = opts.method;
        this.url = new URL(opts.url);
        this.headers = opts.headers;
        this.body = opts.body;
    }

    send(options: MessageOptions) {
        fetch(this.url, {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify({
                ...this.body,
                options
            })
        });
    }
}
