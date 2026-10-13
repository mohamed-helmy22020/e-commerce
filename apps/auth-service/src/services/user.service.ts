import { AppError } from "shared";
import * as userRepo from "../repositories/user.repo";
import { convertToPublicUser } from "../utils/auth.utils";

export async function getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return convertToPublicUser(user);
}
