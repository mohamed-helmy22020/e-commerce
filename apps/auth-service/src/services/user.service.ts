import { AppError } from "shared";
import * as userRepo from "../repositories/user.repo";
import { UpdateUserInput } from "../schemas/auth.schemas";
import { convertToPublicUser } from "../utils/auth.utils";
import { comparePassword, hashPassword } from "../utils/hash";

export async function getMe(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return convertToPublicUser(user);
}

export async function updateUser(input: UpdateUserInput, userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (input.email) {
        if (!input.password) {
            throw new AppError("Password is required when updating email", 400);
        }
        const existingUser = await userRepo.findByEmail(input.email);
        if (existingUser && existingUser.id !== user.id) {
            throw new AppError("Email already exists", 409);
        }
        const isValidPassword = await comparePassword(
            input.password,
            user.password_hash,
        );
        if (!isValidPassword) {
            throw new AppError("Invalid password", 401);
        }
    }

    let newPasswordHash = undefined;
    if (input.newPassword) {
        if (!input.password) {
            throw new AppError(
                "old password is required when updating password",
                400,
            );
        }
        const isValidPassword = await comparePassword(
            input.password,
            user.password_hash,
        );
        if (!isValidPassword) {
            throw new AppError("Invalid password", 401);
        }
        newPasswordHash = await hashPassword(input.newPassword);
    }

    const updatedUser = await userRepo.updateUserById({
        id: user.id,
        userData: {
            name: input.name,
            email: input.email,
            password_hash: newPasswordHash,
        },
    });
    return convertToPublicUser(updatedUser);
}
