import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({ message: "Name should be a string" })
        .min(2, { message: "Name is too short" }),
    email: z.email({ message: "Email is invalid" }),
    password: z
        .string({ message: "Password is required" })
        .min(8, { message: "Password is too short" }),
});

export const loginSchema = z.object({
    email: z.email({ message: "Email is invalid" }),
    password: z
        .string({ message: "Password is required" })
        .min(8, { message: "Password is too short" }),
    twoFactorCode: z.string().min(6).optional(),
});

export const verifyEmailSchema = z.object({
    token: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
