import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export function validateBody(
    schema: Joi.ObjectSchema | Joi.AlternativesSchema
) {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors = schema.validate(req.body).error?.details;
        const out: any[] = [];
        if (!errors) {
            return next();
        }

        errors.forEach((err) => {
            if (!errors[0].context?.details) {
                out.push(err.message.replace(/"/g, "'"));
            } else {
                out.push(
                    err.context?.details
                        .map((ctx: any) => ctx.message.replace(/"/g, "'"))
                        .join(" OR ")
                );
            }
        });

        return res.status(400).json({
            status: 400,
            message: "Bad Request",
            errors: out,
        });
    };
}
