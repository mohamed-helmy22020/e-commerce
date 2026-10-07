import { NextFunction, Request, Response } from "express";
import { AppError } from "./AppError";
export function errorHandler(
    err: any,
    _req: Request,
    _res: Response,
    _next: NextFunction,
) {
    console.log("###########");
    console.log(err);
    console.log("###########");
    if (err instanceof AppError) {
        return _res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    if (err.message.includes("not valid JSON")) {
        return _res.status(400).json({
            success: false,
            message: "Request body is not valid JSON",
        });
    }
    if (err.code === "23505") {
        throw new AppError("User already exists", 409);
    }

    return _res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}
