import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signupSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters.")
        .max(60, "Name must be 60 characters or fewer."),
    email: z.email("Enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Enter a valid email address."),
});

export const resetPasswordSchema = z
    .object({
        password: z.string().min(8, "Password must be at least 8 characters."),
        confirmPassword: z.string(),
    })
    .refine((values) => values.password === values.confirmPassword, {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    });

export const profileSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must be at least 2 characters.")
            .max(60, "Name must be 60 characters or fewer."),
        email: z.email("Enter a valid email address."),
        /**
         * Current password. Required when the email or the password changes,
         * since the backend needs it to authorise either update. Empty
         * otherwise.
         */
        password: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .optional()
            .or(z.literal("")),
        /** New password. Optional; blank keeps the current password. */
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters.")
            .optional()
            .or(z.literal("")),
        confirmNewPassword: z.string().optional().or(z.literal("")),
    })
    .refine(
        (values) =>
            !values.newPassword ||
            values.newPassword === values.confirmNewPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmNewPassword"],
        },
    );

export type LoginValues = z.infer<typeof loginSchema>;
export type SignupValues = z.infer<typeof signupSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
export type ProfileValues = z.infer<typeof profileSchema>;
