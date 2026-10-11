"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { PasswordField } from "@/components/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { resetPassword } from "@/lib/actions/auth-actions";
import {
    resetPasswordSchema,
    type ResetPasswordValues,
} from "@/lib/authSchema";

export function ResetPasswordForm({ token }: { token: string }) {
    const [done, setDone] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
        mode: "onTouched",
    });
    useLayoutEffect(() => {
        form.reset();
    }, []);

    const onSubmit = async (values: ResetPasswordValues) => {
        const result = await resetPassword(token, values);
        if (!result.ok) {
            if (result.fieldErrors) {
                if (result.fieldErrors.properties?.password?.errors) {
                    form.setError("password", {
                        message:
                            result.fieldErrors.properties?.password?.errors[0],
                    });
                }
                if (result.fieldErrors.properties?.confirmPassword?.errors) {
                    form.setError("confirmPassword", {
                        message:
                            result.fieldErrors.properties?.confirmPassword
                                ?.errors[0],
                    });
                }
            } else {
                form.setError("root", {
                    message: result.message,
                });
            }
            return;
        }
        setDone(true);
        form.reset();
    };

    if (done) {
        return (
            <div className="flex flex-col items-center gap-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                    <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </span>

                <div className="space-y-2">
                    <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                        Password updated
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Your password has been reset. Sign in with your new
                        password to continue.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3">
                    <AuthSubmitButton asChild>
                        <Link href="/login">Sign in</Link>
                    </AuthSubmitButton>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
        >
            <FieldGroup className="gap-5">
                <PasswordField
                    control={form.control}
                    name="password"
                    label="New password"
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                />
                <PasswordField
                    control={form.control}
                    name="confirmPassword"
                    label="Confirm password"
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                />
            </FieldGroup>

            {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}{" "}
                    <Link
                        href="/forgot-password"
                        className="font-medium text-zinc-900 underline underline-offset-4 dark:text-zinc-100"
                    >
                        Request a new link
                    </Link>
                </p>
            )}

            <AuthSubmitButton disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Updating password
                    </>
                ) : (
                    "Update password"
                )}
            </AuthSubmitButton>
        </form>
    );
}
