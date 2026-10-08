import type { Request, Response } from "express";
import {
    AppError,
    failResponse,
    requireIdentity,
    successResponse,
} from "shared";
import z from "zod";
import * as refreshTokenRepo from "../repositories/refreshToken.repo";
import {
    ForgotPasswordInput,
    LoginInput,
    RegisterInput,
    ResetPasswordInput,
    TwoFAVerifyInput,
    VerifyEmailInput,
    verifyEmailSchema,
} from "../schemas/auth.schemas";
import * as authService from "../services/auth.service";
import { convertToPublicUser } from "../utils/auth.utils";

export async function register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
) {
    const result = await authService.register(req.body);
    return successResponse(res, result, 201);
}

export async function verifyEmail(
    req: Request<VerifyEmailInput>,
    res: Response,
) {
    const result = verifyEmailSchema.safeParse(req.params);

    if (!result.success) {
        const message = z.treeifyError(result.error);
        return failResponse(res, message, 400);
    }

    await authService.verifyEmail(result.data.token);

    return successResponse(res, { message: "Email verified" }, 200);
}

export async function refreshHandler(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
        throw new AppError("Missing refresh token", 401);
    }

    const { newAccessToken, newRefreshToken, user } =
        await authService.refreshToken(refreshToken);

    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(200).json({
        message: "Refresh token successful",
        accessToken: newAccessToken,
        user: convertToPublicUser(user),
    });
}

export async function login(req: Request<{}, {}, LoginInput>, res: Response) {
    const { refreshToken, ...result } = await authService.login(req.body);
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000,
    });
    return successResponse(res, result, 200);
}

export async function logoutHandler(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
        throw new AppError("Missing refresh token", 401);
    }
    res.clearCookie("refreshToken", { path: "/" });
    await refreshTokenRepo.revokeRefreshToken(refreshToken);
    return res.status(200).json({ message: "Logged out successfully" });
}

export async function getMe(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(401).json({ message: "Missing x-user-id header" });
    }
    const user = await authService.getMe(userId);
    return successResponse(res, { user }, 200);
}

export async function forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response,
) {
    const email = req.body.email;
    const normalizedEmail = email?.toLowerCase();

    await authService.forgotPassword(normalizedEmail);

    return res.status(200).json({
        success: true,
        message:
            "if an account with this email exists, we will send you a reset link",
    });
}

export async function resetPasswordHandler(
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response,
) {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);

    return res.status(200).json({ message: "Password reset successfully" });
}

export async function twoFASetup(req: Request, res: Response) {
    const { userId } = requireIdentity(req);

    const { otpauthURI, secret } = await authService.twoFASetup(userId);
    return res.status(200).json({
        message: "Two factor setup successful",
        otpauthURI,
        secret,
    });
}

export async function twoFAVerifyHandler(
    req: Request<{}, {}, TwoFAVerifyInput>,
    res: Response,
) {
    const { userId } = requireIdentity(req);
    const { code } = req.body;

    await authService.twoFAVerify(userId, code);

    return res.status(200).json({ message: "Two factor enabled successfully" });
}
