import type { Request, Response } from "express";
import { successResponse } from "shared";
import { z } from "zod";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
import * as authService from "../services/auth.service";

export async function register(
    req: Request<{}, {}, z.infer<typeof registerSchema>>,
    res: Response,
) {
    const result = await authService.register(req.body);
    return successResponse(res, result, 201);
}

export async function login(
    req: Request<{}, {}, z.infer<typeof loginSchema>>,
    res: Response,
) {
    const result = await authService.login(req.body);
    return successResponse(res, result, 200);
}

export async function getMe(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(401).json({ message: "Missing x-user-id header" });
    }
    const user = await authService.getMe(userId);
    return successResponse(res, { user }, 200);
}
