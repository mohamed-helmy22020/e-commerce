import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { AppError, createAccessToken, createRefreshToken } from "shared";
import * as userRepo from "../repositories/user.repo";
import { hashPassword } from "../utils/hash";

export function getGoogleClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error("Missing Google client credentials");
    }

    return new OAuth2Client(clientId, clientSecret, redirectUri);
}

export async function googleAuthCallback(code: string) {
    const client = getGoogleClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.id_token) {
        throw new AppError("No id_token is present", 400);
    }
    const ticket = await client.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload?.email;
    const emailVerified = payload?.email_verified;
    const name = payload?.name;
    if (!email || !emailVerified || !name) {
        throw new AppError("Invalid payload", 400);
    }

    let user = await userRepo.findByEmail(email.toLowerCase());
    if (!user) {
        const randomPassword = crypto.randomBytes(16).toString("hex");
        const hashedPassword = await hashPassword(randomPassword);
        user = await userRepo.createUser({
            name,
            email: email.toLowerCase(),
            passwordHash: hashedPassword,
            role: "USER",
            isEmailVerified: true,
        });
    } else {
        if (!user.is_email_verified) {
            userRepo.updateUserById({
                id: user.id,
                userData: {
                    is_email_verified: true,
                },
            });
        }
    }

    const accessToken = createAccessToken({ userId: user.id, role: user.role });

    const refreshToken = createRefreshToken(user.id);

    return {
        accessToken,
        refreshToken,
        user,
    };
}
