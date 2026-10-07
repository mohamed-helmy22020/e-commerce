import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
export function errorHandler(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {
    console.log("###########");
    console.log({ ...err, message: err?.message });
    console.log("###########");
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    // json body errors
    if (
        typeof err?.message === "string" &&
        (err.message.includes("not valid JSON") ||
            err?.type === "entity.parse.failed")
    ) {
        return res.status(400).json({
            success: false,
            message: "Request body is not a valid JSON",
        });
    }

    // postgres errors
    if (err?.code === "23505") {
        return res
            .status(409)
            .json({ success: false, message: "User already exists" });
    }

    // jwt errors
    if (err?.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Token expired",
        });
    }
    if (err?.name === "JsonWebTokenError") {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
    if (err?.name === "NotBeforeError") {
        return res.status(401).json({
            success: false,
            message: "Token not active yet",
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
