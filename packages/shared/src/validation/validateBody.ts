import type { NextFunction, Request, Response } from "express";
import z, { ZodObject } from "zod";
import { failResponse } from "../response/response";
export function validateBody(schema: ZodObject) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const message = z.treeifyError(result.error);
            return failResponse(res, message, 400);
        }
        req.body = result.data;
        next();
    };
}
