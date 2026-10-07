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
    return jwt.verify(token, getSecret("access")) as JwtPayload;
}

export function verifyRefreshToken(token: string) {
    return jwt.verify(token, getSecret("refresh")) as {
        userId: string;
    };
}
