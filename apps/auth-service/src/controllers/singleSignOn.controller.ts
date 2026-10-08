import type { Request, Response } from "express";
import { AppError } from "shared";
import * as singleSignOnService from "../services/singleSignOn.service";
import { convertToPublicUser } from "../utils/auth.utils";

export async function googleAuthStartHandler(_req: Request, res: Response) {
    const client = singleSignOnService.getGoogleClient();
    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email", "openid"],
    });

    return res.redirect(url);
}
export async function googleAuthCallbackHandler(req: Request, res: Response) {
    const code = req.query.code as string | undefined;
    if (!code) {
        throw new AppError("Missing code", 400);
    }

    const { accessToken, refreshToken, user } =
        await singleSignOnService.googleAuthCallback(code);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res
        .status(200)
        .json({ accessToken, user: convertToPublicUser(user) });
}
