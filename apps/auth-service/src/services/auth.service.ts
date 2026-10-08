import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
    AppError,
    createAccessToken,
    createRefreshToken,
    getPool,
    getSecret,
    sendEmail,
    verifyRefreshToken,
} from "shared";
import * as refreshTokenRepo from "../repositories/refreshToken.repo";
import * as userRepo from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schemas";
import { convertToPublicUser } from "../utils/auth.utils";
import { comparePassword, hashPassword, hashToken } from "../utils/hash";

function getAppUrl() {
    return process.env.APP_URL!;
}

export async function register(input: RegisterInput) {
    const normalizedEmail = input.email.toLowerCase();
    const existingUser = await userRepo.findByEmail(normalizedEmail);
    if (existingUser) {
        throw new AppError("User already exists", 409);
    }
    const passwordHash = await hashPassword(input.password);
    const user = await userRepo.createUser({
        name: input.name,
        email: normalizedEmail,
        passwordHash,
        role: "USER",
    });
    const accessToken = createAccessToken({ userId: user.id, role: user.role });
    const emailVerificationToken = jwt.sign(
        {
            sub: user.id,
        },
        process.env.JWT_ACCESS_SECRET!,
        {
            expiresIn: "1h",
        },
    );
    const emailVerificationUrl = `${getAppUrl()}/auth/verify-email/${emailVerificationToken}`;

    await sendEmail(
        user.email,
        "Verify your email",
        `
            <p>Click the link below to verify your email address:</p>
            <p><a href="${emailVerificationUrl}">${emailVerificationUrl}</a></p>
            <p>If you didn't request this email, please ignore this message.</p>
            <p>Thanks,<br>The Team</p>
            <p><small>Note: replies to this email address are not monitored.</small></p>

        `,
    );
    return {
        accessToken,
        user: convertToPublicUser(user),
    };
}

export async function verifyEmail(token: string) {
    const payload = jwt.verify(token, getSecret("access")) as {
        sub: string;
    };

    const user = await userRepo.findById(payload.sub);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.is_email_verified) {
        throw new AppError("Email already verified", 409);
    }

    return await userRepo.verifyEmail(user.id);
}

export async function login(input: LoginInput) {
    const normalizedEmail = input.email.toLowerCase();
    const user = await userRepo.findByEmail(normalizedEmail);
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    const passwordMatch = await comparePassword(
        input.password,
        user.password_hash,
    );
    if (!passwordMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    // TODO: check if user has 2FA enabled
    const accessToken = createAccessToken({ userId: user.id, role: user.role });
    const refreshToken = createRefreshToken(user.id);
    const refreshTokenHash = hashToken(refreshToken);

    await refreshTokenRepo.addRefreshTokenHash(user.id, refreshTokenHash);

    return {
        accessToken,
        refreshToken,
        user: convertToPublicUser(user),
    };
}

export async function getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return convertToPublicUser(user);
}

export async function refreshToken(refreshToken: string) {
    const tokenHash = hashToken(refreshToken);

    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepo.findById(payload.userId);
    if (!user) {
        throw new AppError("Invalid refresh token", 401);
    }
    const client = await getPool().connect();
    try {
        await client.query("BEGIN");

        const refreshTokenEntery = await refreshTokenRepo.findByTokenHash(
            tokenHash,
            client,
        );

        if (!refreshTokenEntery) {
            throw new AppError("Invalid refresh token", 401);
        }
        if (refreshTokenEntery.revoked) {
            await refreshTokenRepo.revokeAllRefreshTokensByFamilyId(
                refreshTokenEntery.family_id,
                client,
            );
            await client.query("COMMIT");
            throw new AppError("Invalid refresh token", 401);
        }

        await refreshTokenRepo.revokeRefreshToken(tokenHash, client);

        const newAccessToken = createAccessToken({
            userId: user.id,
            role: user.role,
        });

        const newRefreshToken = createRefreshToken(user.id);
        const newRefreshTokenHash = hashToken(newRefreshToken);

        await refreshTokenRepo.addRefreshTokenHash(
            user.id,
            newRefreshTokenHash,
            refreshTokenEntery.family_id,
            client,
        );
        await client.query("COMMIT");

        return {
            newAccessToken,
            newRefreshToken,
            user,
        };
    } catch (err) {
        try {
            await client.query("ROLLBACK");
        } catch {}
        throw err;
    } finally {
        client.release();
    }
}

export async function forgotPassword(email: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) {
        return false;
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
        .createHash("sha256")
        .update(rawToken)
        .digest("hex");

    await userRepo.updateUserById({
        id: user.id,
        userData: {
            reset_password_token: tokenHash,
            reset_password_expires_at: new Date(Date.now() + 15 * 60 * 1000),
        },
    });

    const resetPasswordUrl = `${getAppUrl()}/auth/reset-password/${tokenHash}`;

    await sendEmail(
        user.email,
        "Reset your password",
        `
            <p>Click the link below to reset your password:</p>
            <p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
            <p>or use this token: <br /><strong style="font-size: 20px; font-family: monospace;">${rawToken}</strong></p>
            <p>If you didn't request this email, please ignore this message.</p>
            <p>Thanks,<br>The Team</p>
            <p><small>Note: replies to this email address are not monitored.</small></p>

        `,
    );
    return true;
}

export async function resetPassword(token: string, password: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userRepo.findByResetPasswordToken(hashedToken);
    if (!user) {
        throw new AppError("Invalid token", 404);
    }

    const newPasswordHash = await hashPassword(password);
    await userRepo.updateUserById({
        id: user.id,
        userData: {
            reset_password_token: "",
            reset_password_expires_at: new Date(),
            password_hash: newPasswordHash,
        },
    });
}
