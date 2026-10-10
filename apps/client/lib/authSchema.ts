import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(60, "Name must be 60 characters or fewer."),
    email: z.email("Enter a valid email address."),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Enter a valid email address."),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
