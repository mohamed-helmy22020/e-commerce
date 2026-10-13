"use server";
import { revalidatePath } from "next/cache";
import z from "zod";

import { api } from "../api-server";
import { profileSchema, type ProfileValues } from "../authSchema";

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

export async function updateUser(values: ProfileValues) {
    const parsedValues = profileSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            ok: false as const,
            error: "validation error",
            fieldErrors: z.treeifyError(parsedValues.error),
        };
    }

    const { name, email, password, newPassword } = parsedValues.data;

    try {
        const current = await getCurrentUser();
        if (!current) {
            return {
                ok: false as const,
                message: "You must be signed in to update your profile.",
            };
        }

        const body: {
            name: string;
            email?: string;
            password?: string;
            newPassword?: string;
        } = { name };

        // The backend rejects any request that carries an email without the
        // current password (even when the email is unchanged), so only send
        // the email when it actually changes.
        const emailChanged =
            email.trim().toLowerCase() !== current.email.trim().toLowerCase();
        if (emailChanged) {
            if (!password) {
                return {
                    ok: false as const,
                    message:
                        "Enter your current password to change your email.",
                };
            }
            body.email = email;
            body.password = password;
        }

        // Changing the password also requires the current password. It is the
        // same field the email branch uses, so a combined update sends it once.
        if (newPassword) {
            if (!password) {
                return {
                    ok: false as const,
                    message:
                        "Enter your current password to change your password.",
                };
            }
            body.password = password;
            body.newPassword = newPassword;
        }

        const result = await api<SuccessResponse<{ user: User }>>("/user/me", {
            method: "POST",
            body: JSON.stringify(body),
        });

        // Read-your-own-writes: refresh the read-only profile views.
        revalidatePath("/settings");
        revalidatePath("/settings/edit");

        return { ok: true as const, data: result.data };
    } catch (error: any) {
        return {
            ok: false as const,
            message:
                typeof error?.message === "string"
                    ? error.message
                    : "Something went wrong updating your profile.",
        };
    }
}
