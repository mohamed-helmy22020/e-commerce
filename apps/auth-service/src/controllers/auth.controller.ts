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
    Delete2FAInput,
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
import { hashToken } from "../utils/hash";

export async function register(
    req: Request<{}, {}, RegisterInput>,
    res: Response,
) {
    const result = await authService.register(req.body);
    return successResponse(
        res,
        { message: "Registered successfully", ...result },
        201,
    );
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
    return successResponse(
        res,
        { message: "Logged in successfully", ...result },
        200,
    );
}

export async function logoutHandler(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken as string | undefined;
    if (!refreshToken) {
        throw new AppError("Missing refresh token", 401);
    }
    res.clearCookie("refreshToken", { path: "/" });
    await refreshTokenRepo.revokeRefreshToken(hashToken(refreshToken));
    return successResponse(res, { message: "Logged out successfully" }, 200);
}

export async function forgotPasswordHandler(
    req: Request<{}, {}, ForgotPasswordInput>,
    res: Response,
) {
    const email = req.body.email;
    const normalizedEmail = email?.toLowerCase();

    await authService.forgotPassword(normalizedEmail);

    return successResponse(
        res,
        {
            message:
                "if an account with this email exists, we will send you a reset link",
        },
        200,
    );
}

export async function resetPasswordHandler(
    req: Request<{}, {}, ResetPasswordInput>,
    res: Response,
) {
    const { token, password } = req.body;

    await authService.resetPassword(token, password);
    return successResponse(
        res,
        { message: "Password reset successfully" },
        200,
    );
}

export async function twoFASetup(req: Request, res: Response) {
    const { userId } = requireIdentity(req);

    const { otpauthURI, secret } = await authService.twoFASetup(userId);
    return successResponse(
        res,
        {
            message: "Two factor setup successful",
            otpauthURI,
            secret,
        },
        200,
    );
}

export async function twoFAVerifyHandler(
    req: Request<{}, {}, TwoFAVerifyInput>,
    res: Response,
) {
    const { userId } = requireIdentity(req);
    const { code } = req.body;

    await authService.twoFAVerify(userId, code);
    return successResponse(
        res,
        { message: "Two factor enabled successfully" },
        200,
    );
}

export async function delete2FA(
    req: Request<{}, {}, Delete2FAInput>,
    res: Response,
) {
    const { userId } = requireIdentity(req);
    const { password, code } = req.body;

    await authService.delete2FA(userId, password, code);
    return successResponse(
        res,
        { message: "Two factor disabled successfully" },
        200,
    );
}
