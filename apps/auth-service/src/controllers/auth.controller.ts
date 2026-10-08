import type { Request, Response } from "express";
import { AppError, failResponse, successResponse } from "shared";
import z from "zod";
import {
    LoginInput,
    RegisterInput,
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

export async function logoutHandler(_req: Request, res: Response) {
    res.clearCookie("refreshToken", { path: "/" });
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
