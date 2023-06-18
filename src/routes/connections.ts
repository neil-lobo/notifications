import { Request, Response, Router, json } from "express";
import { connections as c } from "../index.js";

const router = Router();

router.get("/connections", (req: Request, res: Response) => {
    const out = Array.from(c).map(conn => {
        return {
            label: conn[1].label,
            platform: conn[1].platform
        }
    })

    res.json(out);
})

export {router as connections};