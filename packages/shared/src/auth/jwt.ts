import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

export function getSecret(type: "access" | "refresh" = "access") {
    let secret;
    if (type === "access") {
        secret = process.env.JWT_ACCESS_SECRET;
    } else {
        secret = process.env.JWT_REFRESH_SECRET;
    }
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET is missing or too short");
    }
    return secret;
}

export function createAccessToken(payload: JwtPayload) {
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        "15m") as jwt.SignOptions["expiresIn"];
    return jwt.sign(payload, getSecret("access"), {
        expiresIn,
        algorithm: "HS256",
    });
}

export function createRefreshToken(userId: string) {
    return jwt.sign(
        {
            userId,
        },
        getSecret("refresh"),
        {
            expiresIn: "7d",
        },
    );
}

export function verifyAccessToken(token: string) {
    const payload = jwt.verify(token, getSecret("access"), {
        algorithms: ["HS256"],
    }) as JwtPayload;
    if (!payload.userId || !payload.role) {
        throw new Error("Invalid JWT payload");
    }
    return payload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, getSecret("refresh"), {
        algorithms: ["HS256"],
    }) as {
        userId: string;
    };
}
