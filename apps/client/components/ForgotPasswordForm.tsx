"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { FieldGroup } from "@/components/ui/field";
import {
    forgotPasswordSchema,
    type ForgotPasswordValues,
} from "@/lib/authSchema";

export function ForgotPasswordForm() {
    const [sentTo, setSentTo] = useState<string | null>(null);

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: { email: "" },
        mode: "onTouched",
    });

    const onSubmit = (values: ForgotPasswordValues) => {
        // UI only — no email is actually sent.
        setSentTo(values.email);
    };

    if (sentTo) {
        return (
            <div className="flex flex-col items-center gap-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                    <MailCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                </span>

                <div className="space-y-2">
                    <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                        Check your email
                    </h2>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        We sent a password reset link to{" "}
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                            {sentTo}
                        </span>
                        . It may take a minute to arrive — remember to check
                        spam.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3">
                    <AuthSubmitButton asChild>
                        <Link href="/login">Back to sign in</Link>
                    </AuthSubmitButton>
                    <button
                        type="button"
                        onClick={() => setSentTo(null)}
                        className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        Use a different email
                    </button>
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
                <AuthField
                    control={form.control}
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                />
            </FieldGroup>

            <AuthSubmitButton>Send reset link</AuthSubmitButton>
        </form>
    );
}
