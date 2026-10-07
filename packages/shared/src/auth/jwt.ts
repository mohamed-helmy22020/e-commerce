import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

function getSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
        throw new Error("JWT_SECRET is missing or too short");
    }
    return secret;
}

export function signToken(payload: JwtPayload): string {
    const expiresIn = (process.env.JWT_EXPIRES_IN ||
        "1h") as jwt.SignOptions["expiresIn"];
    return jwt.sign(payload, getSecret(), {
        expiresIn,
        algorithm: "HS256",
    });
}

export function verifyToken(token: string) {
    const decodeToken = jwt.verify(token, getSecret(), {
        algorithms: ["HS256"],
    });
    if (
        typeof decodeToken !== "object" ||
        decodeToken === null ||
        typeof decodeToken.userId !== "string" ||
        !decodeToken.userId ||
        !decodeToken.role
    ) {
        throw new Error("Invalid token");
    }

    // Strictly validate role against allowed values
    if (decodeToken.role !== "USER" && decodeToken.role !== "ADMIN") {
        throw new Error("Invalid role");
    }

    return {
        userId: decodeToken.userId,
        role: decodeToken.role,
    };
}
