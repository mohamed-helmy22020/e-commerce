import { Request, Response } from "express";
import { successResponse } from "shared";
import * as userService from "../services/user.service";

export async function getMe(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
        return res.status(401).json({ message: "Missing x-user-id header" });
    }
    const user = await userService.getMe(userId);
    return successResponse(res, { user }, 200);
}
