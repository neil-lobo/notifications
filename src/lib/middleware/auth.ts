import config from "../config.js";
import jsonwebtoken from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";

const SECRET = config.jwt.secret;

export function verify(token: string) {
    try {
        return jsonwebtoken.verify(token, SECRET)
    } catch(err) {}
}

// Header format:
// Authorization: <jwt>
export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization
    
    if (!token) {
        return res.status(400).json({
            status: 400,
            message: "Missing token"
        });
    }
    
    const data = verify(token)
    if (!data) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized"
        });
    }

    next()
}