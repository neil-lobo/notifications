import { NextFunction, Request, Response, Router, json } from "express";
import { auth } from "../lib/middleware/auth.js";
import { connections } from "../index.js";
import { MessageOptions } from "../lib/connection/connection.js";
import jsonwebtoken from "jsonwebtoken";
import Joi from "joi";
import { validateBody } from "../lib/middleware/validate.js";

interface NotifyBody {
    label: string;
    options: MessageOptions;
}

const router = Router();

const schema = Joi.object({
    label: Joi.string().required(),
    options: {
        title: Joi.string().optional(),
        message: Joi.string().required(),
        from: Joi.string().optional(),
    },
});

function verify(req: Request, res: Response, next: NextFunction) {
    const body: NotifyBody = req.body;
    const token: any = req.headers.authorization?.slice(7);
    const data: any = jsonwebtoken.decode(token);

    if (!connections.has(body.label)) {
        return res.status(404).json({
            status: 404,
            message: `No connection with label '${body.label}'`,
        });
    }

    if (!data.labels?.includes(body.label)) {
        return res.status(403).json({
            status: 403,
            message: `Missing '${body.label}' label on token`,
        });
    }

    next();
}

const middleware = [auth, json(), validateBody(schema), verify];

router.post("/notify", middleware, (req: Request, res: Response) => {
    const body: NotifyBody = req.body;

    const connection = connections.get(body.label);
    connection?.send(body.options);

    res.json({
        status: 200,
    });
});

export { router as notify };
