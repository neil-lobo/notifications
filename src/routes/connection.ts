import { NextFunction, Request, Response, Router, json } from "express";
import { connections } from "../index.js";
import { auth } from "../lib/middleware/auth.js";
import jsonwebtoken from "jsonwebtoken"
import { Platform } from "../lib/connection/connection.js";
import config from "../lib/config.js";
import { deleteOne, findOne, insertOne } from "../lib/db.js";
import { createConnection } from "../lib/connections.js";

const router = Router();

function verify(action: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const label = req.body.label

        // need database configured to use endpoints
        if(!config.db) {
            return res.status(503).json({
                status: 503,
                message: "Service not configured to create/delete connections"
            })
        }

        if (!label) {
            return res.status(400).json({
                status: 400,
                message: "Missing `label` field"
            })
        }

        const token: any = req.headers.authorization
        const data: any = jsonwebtoken.decode(token)
        
        if (!data.actions?.includes(action)) {
            return res.status(403).json({
                status: 403,
                message: `Missing '${action}' action on token`
            })
        }

        next();
    }
}

router.post("/connection", [auth, json(), verify("connection:create")], async (req: Request, res: Response) => {   
    const platform: Platform = req.body.platform;
    const label: string = req.body.label
    const options = req.body.options

    if (!platform) {
        return res.status(400).json({
            status: 400,
            message: "Missing `platform` field"
        })
    }
    
    if (!Object.values(Platform).includes(platform)) {
        return res.status(400).json({
            status: 400,
            message: "Invalid `platform` field"
        })
    }
    
    switch(platform) {
        case Platform.TWITCH: {
            if (!options?.username) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing `options.username` field"
                })
            }
            if (!options?.password) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing `options.password` field"
                })
            }
            if (!options?.channels) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing `options.channels` field"
                })
            }

            break;
        }
        case Platform.DISCORD: {
            if (!options?.webhooks) {
                return res.status(400).json({
                    status: 400,
                    message: "Missing `options.webhooks` field"
                })
            }
            break;   
        }
        case Platform.HTTP: {
            break;
        }
    }

    const existing = await findOne({label: label})
    if (existing) {
        return res.status(400).json({
            status: 400,
            message: `Connection with label '${label}' already created`
        })
    }

    const {acknowledged, insertedId} = await insertOne({
        label: label,
        platform,
        options: options ?? {}
    })

    if (!acknowledged) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    } 

    const conn = createConnection(platform, label, options)
    connections.set(label, conn)

    return res.json({
        status: 200,
        message: "Connection created"
    });
})

router.delete("/connection", [auth, json(), verify("connection:delete")], async (req: Request, res: Response) => {
    const label = req.body.label
    const {acknowledged, deletedCount} = await deleteOne({label: label})

    if (!acknowledged) {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }
    
    if (deletedCount === 0) {
        return res.status(404).json({
            status: 404,
            message: `No connection with label '${label}' found`
        })
    }

    connections.delete(label)

    res.json({
        status: 200,
        message: "Connection deleted"
    });
})

export {router as connection};