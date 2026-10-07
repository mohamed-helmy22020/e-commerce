import jwt from "jsonwebtoken";
import {
    AppError,
    createAccessToken,
    createRefreshToken,
    getSecret,
} from "shared";
import * as userRepo from "../repositories/user.repo";
import { LoginInput, RegisterInput } from "../schemas/auth.schemas";
import { convertToPublicUser } from "../utils/auth.utils";
import { comparePassword, hashPassword } from "../utils/hash";

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

    // TODO: send email verification email
    // await sendEmail(
    //     user.email,
    //     "Verify your email",
    //     `
    //         <p>Click the link below to verify your email address:</p>
    //         <p><a href="${emailVerificationUrl}">${emailVerificationUrl}</a></p>
    //         <p>If you didn't request this email, please ignore this message.</p>
    //         <p>Thanks,<br>The Team</p>
    //         <p><small>Note: replies to this email address are not monitored.</small></p>

    //     `,
    // );
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
