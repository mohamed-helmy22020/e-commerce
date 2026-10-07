import jwt from "jsonwebtoken";
import { JwtPayload } from "./types";

export function signToken(payload: JwtPayload): string {
    const expiresIn = process.env.JWT_EXPIRES_IN as string;
    return jwt.sign(payload, process.env.JWT_SECRET as string, {
        expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
        algorithm: "HS256",
    });
}

export function verifyToken(token: string) {
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET as string, {
        algorithms: ["HS256"],
    });
    if (
        typeof decodeToken !== "object" ||
        !decodeToken.userId ||
        !decodeToken.role
    ) {
        throw new Error("Invalid token");
    }

    return {
        userId: decodeToken.userId,
        role: decodeToken.role,
    };
}
