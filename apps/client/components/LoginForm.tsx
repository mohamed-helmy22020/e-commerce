"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { PasswordField } from "@/components/PasswordField";
import { FieldGroup } from "@/components/ui/field";
import { login } from "@/lib/actions/auth-actions";
import { loginSchema, type LoginValues } from "@/lib/authSchema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Where to land after signing in. The proxy sends guarded requests to
 * /login?next=..., so honour that when it is a safe same-origin path.
 */
function nextPath() {
    const next = new URLSearchParams(window.location.search).get("next");
    if (next && next.startsWith("/") && !next.startsWith("//")) return next;
    return "/";
}

export function LoginForm() {
    const router = useRouter();
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const form = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "", twoFactorCode: "" },
        mode: "onTouched",
    });
    useLayoutEffect(() => {
        form.reset();
    }, []);
    const onSubmit = async (values: LoginValues) => {
        if (twoFactorRequired) {
            const code = values.twoFactorCode?.trim() ?? "";
            if (!/^\d{6}$/.test(code)) {
                form.setError("twoFactorCode", {
                    message:
                        "Enter the 6-digit code from your authenticator app.",
                });
                return;
            }
        }

        const result = await login(values);
        if (!result.ok) {
            if (result.fieldErrors) {
                if (result.fieldErrors.properties?.email?.errors) {
                    form.setError("email", {
                        message:
                            result.fieldErrors.properties?.email?.errors[0],
                    });
                }
                if (result.fieldErrors.properties?.password?.errors) {
                    form.setError("password", {
                        message:
                            result.fieldErrors.properties?.password?.errors[0],
                    });
                }
            } else if (
                typeof result.message === "string" &&
                result.message.includes("Missing two factor code")
            ) {
                // The account has 2FA on: reveal the code field and try again.
                setTwoFactorRequired(true);
            } else if (
                typeof result.message === "string" &&
                result.message.includes("Invalid two factor code")
            ) {
                form.setError("twoFactorCode", {
                    message: "That code is invalid or has expired. Try again.",
                });
            } else {
                form.setError("root", {
                    message: result.message,
                });
            }
            return;
        }
        form.reset();
        toast.success(result.data?.message);
        router.push(nextPath());
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-6"
        >
            <FieldGroup className="gap-5">
                <AuthField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
                <PasswordField
                    control={form.control}
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    action={
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                            Forgot password?
                        </Link>
                    }
                />
                {twoFactorRequired ? (
                    <>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Two-factor authentication is on. Enter the 6-digit
                            code from your authenticator app to continue.
                        </p>
                        <AuthField
                            control={form.control}
                            name="twoFactorCode"
                            label="Authentication code"
                            inputMode="numeric"
                            maxLength={6}
                            autoFocus
                            autoComplete="one-time-code"
                            placeholder="123456"
                        />
                    </>
                ) : null}
            </FieldGroup>

            {form.formState.errors.root && (
                <p className="text-sm text-destructive">
                    {form.formState.errors.root.message}
                </p>
            )}

            <AuthSubmitButton disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {twoFactorRequired ? "Verifying" : "Logging in"}
                    </>
                ) : twoFactorRequired ? (
                    "Verify and sign in"
                ) : (
                    "Sign in"
                )}
            </AuthSubmitButton>
        </form>
    );
}
