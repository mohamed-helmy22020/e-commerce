"use server";

import { cookies } from "next/headers";
import z from "zod";
import { api } from "../api-server";
import {
    loginSchema,
    LoginValues,
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
        const result = await api<AuthResponse>("/auth/login", {
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
