import { NextFunction, Request, Response, Router, json } from "express";
import { connections } from "../index.js";
import { auth } from "../lib/middleware/auth.js";
import jsonwebtoken from "jsonwebtoken";
import { Platform } from "../lib/connection/connection.js";
import config from "../lib/config.js";
import { deleteOne, findOne, insertOne } from "../lib/db.js";
import { createConnection } from "../lib/connections.js";
import Joi from "joi";
import { validateBody } from "../lib/middleware/validate.js";

const router = Router();

const postSchema = Joi.alternatives().try(
    Joi.object({
        label: Joi.string().required(),
        platform: "TWITCH",
        options: {
            username: Joi.string().required(),
            password: Joi.string().required(),
            channels: Joi.array().items(Joi.string()).required(),
        },
    }),
    Joi.object({
        label: Joi.string().required(),
        platform: "DISCORD",
        options: {
            webhooks: Joi.array().items(Joi.string()).required(),
        },
    }),
    Joi.object({
        label: Joi.string().required(),
        platform: "HTTP",
        options: {},
    })
);

const deleteSchema = Joi.object({
    label: Joi.string().required(),
});

function verify(action: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // need database configured to use endpoints
        if (!config.db) {
            return res.status(503).json({
                status: 503,
                message: "Service not configured to create/delete connections",
            });
        }

        const token: any = req.headers.authorization;
        const data: any = jsonwebtoken.decode(token);

        if (!data.actions?.includes(action)) {
            return res.status(403).json({
                status: 403,
                message: `Missing '${action}' action on token`,
            });
        }

        next();
    };
}

router.post(
    "/connection",
    [auth, json(), validateBody(postSchema), verify("connection:create")],
    async (req: Request, res: Response) => {
        const platform: Platform = req.body.platform;
        const label: string = req.body.label;
        const options = req.body.options;

        const existing = await findOne({ label: label });
        if (existing) {
            return res.status(400).json({
                status: 400,
                message: `Connection with label '${label}' already created`,
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { acknowledged, insertedId } = await insertOne({
            label: label,
            platform,
            options: options ?? {},
        });

        if (!acknowledged) {
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }

        const conn = createConnection(platform, label, options);
        connections.set(label, conn);
        console.log(`[CREATE CONNECTION] ${label} | ${platform}`);

        return res.json({
            status: 200,
            message: "Connection created",
        });
    }
);

router.delete(
    "/connection",
    [auth, json(), validateBody(deleteSchema), verify("connection:delete")],
    async (req: Request, res: Response) => {
        const label = req.body.label;
        const platform = req.body.platform;
        const { acknowledged, deletedCount } = await deleteOne({
            label,
        });

        if (!acknowledged) {
            return res.status(500).json({
                status: 500,
                message: "Internal Server Error",
            });
        }

        if (deletedCount === 0) {
            return res.status(404).json({
                status: 404,
                message: `No connection with label '${label}' found`,
            });
        }

        connections.delete(label);
        console.log(`[DELETE CONNECTION] ${label} | ${platform}`);

        res.json({
            status: 200,
            message: "Connection deleted",
        });
    }
);

export { router as connection };
