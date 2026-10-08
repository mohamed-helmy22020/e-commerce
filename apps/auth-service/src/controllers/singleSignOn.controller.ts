import crypto from "crypto";
import type { Request, Response } from "express";
import { AppError } from "shared";
import * as singleSignOnService from "../services/singleSignOn.service";
import { convertToPublicUser } from "../utils/auth.utils";

export async function googleAuthStartHandler(_req: Request, res: Response) {
    const client = singleSignOnService.getGoogleClient();
    const state = crypto.randomBytes(32).toString("hex");

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("oauth_state", state, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        maxAge: 10 * 60 * 1000, // 10 minutes
    });

    const url = client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: ["profile", "email", "openid"],
        state,
    });

    return res.redirect(url);
}
export async function googleAuthCallbackHandler(req: Request, res: Response) {
    const code = req.query.code;
    const state = req.query.state;
    const storedState = req.cookies?.oauth_state;

    if (typeof code !== "string" || typeof state !== "string") {
        throw new AppError("Invalid code or state", 400);
    }

    if (state !== storedState) {
        throw new AppError("Invalid state", 400);
    }

    res.clearCookie("oauth_state");

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
