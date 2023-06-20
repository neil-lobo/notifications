import { Request, Response, Router } from "express";
import { connections as c } from "../index.js";
import { auth } from "../lib/middleware/auth.js";

const router = Router();

const middleware = [auth];

router.get("/connections", middleware, (req: Request, res: Response) => {
    const out = Array.from(c).map((conn) => {
        return {
            label: conn[1].label,
            platform: conn[1].platform,
        };
    });

    res.json(out);
});

export { router as connections };
