import { NextFunction, Request, Response } from "express";
import { logger } from "../logger/logger";
import { AppError } from "./AppError";
export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.log("###########");
    logger.error({ err }, "Request failed");
    console.log("###########");
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (
        typeof err?.message === "string" &&
        err.message.includes("not valid JSON")
    ) {
        return res.status(400).json({
            success: false,
            message: "Request body is not valid JSON",
        });
    }
    if (err?.code === "23505") {
        return res
            .status(409)
            .json({ success: false, message: "User already exists" });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
