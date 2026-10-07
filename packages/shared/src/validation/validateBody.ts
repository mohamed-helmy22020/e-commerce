import type { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";
import { AppError } from "../errors/AppError";
export function validateBody(schema: ZodObject) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = result.error.issues
                .map((issue) => issue.message)
                .join(", ");

            return next(new AppError(message, 400));
        }
        req.body = result.data;
        next();
    };
}
