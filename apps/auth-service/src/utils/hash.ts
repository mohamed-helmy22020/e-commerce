import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
}

export function hashToken(rawToken: string) {
    const REFRESH_PEPPER = process.env.REFRESH_PEPPER;

    if (!REFRESH_PEPPER) {
        throw new Error("REFRESH_PEPPER is not set");
    }
    return crypto
        .createHmac("sha256", REFRESH_PEPPER)
        .update(rawToken)
        .digest("hex");
}
