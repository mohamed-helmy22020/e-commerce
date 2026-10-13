"use server";
import { api } from "../api-server";

export async function getCurrentUser(): Promise<User | null> {
    try {
        const result = await api<SuccessResponse<{ user: User }>>("/user/me", {
            method: "GET",
        });

        return result.data.user;
    } catch (error: any) {
        return null;
    }
}
