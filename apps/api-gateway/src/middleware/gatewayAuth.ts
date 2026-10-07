import type { NextFunction, Request, Response } from "express";
import { AppError, JwtPayload, verifyAccessToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

const IDENTITY_HEADERS = [
    "x-user-id",
    "x-gateway-secret",
    "x-user-role",
] as const;

function stripIdentityHeaders(req: Request) {
    IDENTITY_HEADERS.forEach((header) => {
        delete req.headers[header];
    });
}

function attachGatewaySecret(req: Request) {
    const GATEWAY_SECRET = process.env.GATEWAY_SECRET;
    if (!GATEWAY_SECRET) {
        throw new AppError("Missing GATEWAY_SECRET", 500);
    }
    req.headers["x-gateway-secret"] = GATEWAY_SECRET;
}

function requestPath(req: Request) {
    const combined = `${req.baseUrl}${req.path}`;
    if (combined.length > 1 && combined.endsWith("/")) {
        return combined.slice(0, -1);
    }
    return combined || "/";
}

function attachUserHeaders(req: Request, payload: JwtPayload) {
    req.headers["x-user-id"] = payload.userId;
    req.headers["x-user-role"] = payload.role;
}

export function gatewayAuth(req: Request, _res: Response, next: NextFunction) {
    try {
        stripIdentityHeaders(req);
        attachGatewaySecret(req);

        const path = requestPath(req);

        if (isPublicRoute(req.method, path)) {
            return next();
        }

        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError("Missing authorization header", 401);
        }
        const token = authHeader.split(" ")[1];
        const payload = verifyAccessToken(token);

        const allowedRoles = getAllowedRoles(req.method, path);

        if (!allowedRoles) {
            throw new AppError("[GATEWAY AUTH] Route not found", 404);
        }

        if (!allowedRoles.includes(payload.role)) {
            throw new AppError("Forbidden to access this route", 403);
        }

        attachUserHeaders(req, payload);
        return next();
    } catch (err) {
        if (err instanceof AppError) {
            return next(err);
        }
        return next(new AppError("invalid or expired token", 401));
    }
}
