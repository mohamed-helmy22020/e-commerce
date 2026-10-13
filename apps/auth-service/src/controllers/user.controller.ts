import { Request, Response } from "express";
import { AppError, requireIdentity, successResponse } from "shared";
import * as userService from "../services/user.service";

export async function getMe(req: Request, res: Response) {
    const { userId } = requireIdentity(req);
    if (!userId) {
        throw new AppError("Missing x-user-id header", 401);
    }
    const user = await userService.getMe(userId);
    return successResponse(res, { user }, 200);
}

export async function updateUser(req: Request, res: Response) {
    const { userId } = requireIdentity(req);
    if (!userId) {
        throw new AppError("Missing x-user-id header", 401);
    }
    const user = await userService.updateUser(req.body, userId);
    return successResponse(res, { user }, 200);
}
