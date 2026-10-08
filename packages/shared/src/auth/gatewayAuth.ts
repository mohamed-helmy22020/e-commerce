import type { NextFunction, Request, Response } from "express";
import { timingSafeEqual } from "node:crypto";
import { AppError } from "../errors/AppError";
import { UserRole } from "./types";

export function requireIdentity(req: Request) {
    const userId = req.headers["x-user-id"] as string;
    const role = req.headers["x-user-role"] as UserRole;
    if (!userId || !role) {
        throw new AppError("Missing user identity", 401);
    }
    return { userId, role };
}

export function requireGatewaySecret(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    const expected = process.env.GATEWAY_SECRET;
    if (!expected) {
        return next(new AppError("Missing GATEWAY_SECRET", 500));
    }
    const incoming = req.headers["x-gateway-secret"];
    const a = Buffer.from(typeof incoming === "string" ? incoming : "");
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
        return next(new AppError("Forbidden", 403));
    }
    next();
}
