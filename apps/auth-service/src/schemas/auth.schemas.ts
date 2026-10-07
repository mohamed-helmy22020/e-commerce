import { z } from "zod";

export const registerSchema = z.object({
    name: z
        .string({ message: "Name is required" })
        .min(1, { message: "Name is required" }),
    email: z.email({ message: "Email is invalid" }),
    password: z
        .string({ message: "Password is required" })
        .min(6, { message: "Password is too short" }),
});

export const loginSchema = z.object({
    email: z.email({ message: "Email is invalid" }),
    password: z.string().min(6, { message: "Password is too short" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
