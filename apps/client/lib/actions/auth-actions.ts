"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
import { api } from "../api-server";
import {
    forgotPasswordSchema,
    ForgotPasswordValues,
    loginSchema,
    LoginValues,
    resetPasswordSchema,
    ResetPasswordValues,
    signupSchema,
    SignupValues,
} from "../authSchema";

export async function createAccount(values: SignupValues) {
    const parsedValues = signupSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            ok: false,
            error: "validation error",
            fieldErrors: z.treeifyError(parsedValues.error),
        };
    }
    try {
        const result = await api<AuthResponse>("/auth/register", {
            skipAuth: true,
            method: "POST",
            body: JSON.stringify(values),
        });
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken);
        return {
            ok: true,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}

export async function login(values: LoginValues) {
    const parsedValues = loginSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            ok: false,
            error: "validation error",
            fieldErrors: z.treeifyError(parsedValues.error),
        };
    }
    try {
        const { email, password, twoFactorCode } = parsedValues.data;
        const result = await api<AuthResponse>("/auth/login", {
            skipAuth: true,
            method: "POST",
            body: JSON.stringify({
                email,
                password,
                // Only send the code when the account has 2FA enabled; the
                // backend rejects an empty string.
                ...(twoFactorCode ? { twoFactorCode } : {}),
            }),
        });
        const cookieStore = await cookies();
        cookieStore.set("accessToken", result.data.accessToken);
        return {
            ok: true,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}

export async function startTwoFactorSetup() {
    try {
        const result = await api<
            SuccessResponse<{
                message: string;
                otpauthURI: string;
                secret: string;
            }>
        >("/auth/2fa-setup", { method: "POST" });
        return {
            ok: true as const,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false as const,
            message:
                typeof error?.message === "string"
                    ? error.message
                    : "Something went wrong starting two-factor setup.",
        };
    }
}

export async function verifyTwoFactor(code: string) {
    try {
        const result = await api<SuccessResponse<{ message: string }>>(
            "/auth/2fa-verify",
            {
                method: "POST",
                body: JSON.stringify({ code }),
            },
        );
        revalidatePath("/settings/security");
        revalidatePath("/settings");
        return {
            ok: true as const,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false as const,
            message:
                typeof error?.message === "string"
                    ? error.message
                    : "Something went wrong verifying the code.",
        };
    }
}

export async function forgotPassword(values: ForgotPasswordValues) {
    const parsedValues = forgotPasswordSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            ok: false,
            error: "validation error",
            fieldErrors: z.treeifyError(parsedValues.error),
        };
    }
    try {
        const result = await api<
            SuccessResponse<{
                message: string;
            }>
        >("/auth/forgot-password", {
            skipAuth: true,
            method: "POST",
            body: JSON.stringify(values),
        });
        return {
            ok: true,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}

export async function resetPassword(
    token: string,
    values: ResetPasswordValues,
) {
    const parsedValues = resetPasswordSchema.safeParse(values);
    if (!parsedValues.success) {
        return {
            ok: false,
            error: "validation error",
            fieldErrors: z.treeifyError(parsedValues.error),
        };
    }
    if (!token) {
        return {
            ok: false,
            message: "This password reset link is invalid or has expired.",
        };
    }
    try {
        const result = await api<
            SuccessResponse<{
                message: string;
            }>
        >("/auth/reset-password", {
            skipAuth: true,
            method: "POST",
            body: JSON.stringify({
                token,
                password: parsedValues.data.password,
            }),
        });
        return {
            ok: true,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false,
            message: error.message,
        };
    }
}

export async function verifyEmail(
    token: string,
): Promise<
    { ok: true; data: { message: string } } | { ok: false; message: string }
> {
    try {
        const result = await api<
            SuccessResponse<{
                message: string;
            }>
        >(`/auth/verify-email/${encodeURIComponent(token)}`, {
            skipAuth: true,
            method: "GET",
        });
        return {
            ok: true,
            data: result.data,
        };
    } catch (error: any) {
        return {
            ok: false,
            message:
                typeof error?.message === "string"
                    ? error.message
                    : "Something went wrong verifying your email.",
        };
    }
}

export async function logout() {
    try {
        await api("/auth/logout", { method: "POST" });
    } catch {
        // Best effort: even if the backend call fails, clear the local session.
    }

    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    redirect("/");
}
