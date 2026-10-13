"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/AuthField";
import { PasswordField } from "@/components/PasswordField";
import { SecondaryButton } from "@/components/SecondaryButton";
import { SettingsCard } from "@/components/SettingsCard";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup } from "@/components/ui/field";
import { deleteTwoFactor } from "@/lib/actions/auth-actions";
import {
    deleteTwoFactorSchema,
    type DeleteTwoFactorValues,
} from "@/lib/authSchema";

/** Two-factor is on: show its status and offer confirm-to-disable. */
export function TwoFactorStatusCard({
    onDisabled,
}: {
    onDisabled: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [disabling, setDisabling] = useState(false);
    const [disableError, setDisableError] = useState<string | null>(null);

    const form = useForm<DeleteTwoFactorValues>({
        resolver: zodResolver(deleteTwoFactorSchema),
        defaultValues: { password: "", code: "" },
        mode: "onTouched",
    });

    const onSubmit = async (values: DeleteTwoFactorValues) => {
        setDisabling(true);
        setDisableError(null);
        try {
            const result = await deleteTwoFactor(values.password, values.code);
            if (!result.ok) {
                setDisableError(result.message);
                toast.error(result.message);
                return;
            }

            toast.success(result.data.message);
            onDisabled();
        } catch {
            const message =
                "Something went wrong disabling two-factor authentication.";
            setDisableError(message);
            toast.error(message);
        } finally {
            setDisabling(false);
        }
    };

    const close = () => {
        setOpen(false);
        setDisableError(null);
        form.reset();
    };

    return (
        <SettingsCard>
            <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    <ShieldCheck className="size-5" />
                </span>
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Two-factor authentication
                        </h2>
                        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            Enabled
                        </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        You&apos;ll be asked for a 6-digit code from your
                        authenticator app each time you sign in.
                    </p>
                </div>
            </div>

            <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
                {!open ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Turn it off to stop asking for a code at sign-in.
                        </p>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setOpen(true)}
                            className="h-12 shrink-0 rounded-full px-6"
                        >
                            Disable two-factor authentication
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
                        <div className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950">
                            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-zinc-500 dark:text-zinc-400" />
                            <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                Confirm your identity to disable two-factor
                                authentication. Enter your account password and a
                                current code from your authenticator app.
                            </p>
                        </div>

                        <FieldGroup className="mt-5 gap-5">
                            <PasswordField
                                control={form.control}
                                name="password"
                                label="Password"
                                autoComplete="current-password"
                            />
                            <AuthField
                                control={form.control}
                                name="code"
                                label="Authentication code"
                                inputMode="numeric"
                                maxLength={6}
                                autoComplete="one-time-code"
                                placeholder="123456"
                            />
                        </FieldGroup>

                        <FieldError
                            className="mt-4"
                            errors={
                                disableError
                                    ? [{ message: disableError }]
                                    : undefined
                            }
                        />

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <SecondaryButton
                                type="button"
                                disabled={disabling}
                                onClick={close}
                            >
                                Cancel
                            </SecondaryButton>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={disabling}
                                className="h-12 rounded-full px-7"
                            >
                                {disabling ? (
                                    <>
                                        <Loader2 className="me-2 size-4 animate-spin" />
                                        Disabling
                                    </>
                                ) : (
                                    "Disable two-factor authentication"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </SettingsCard>
    );
}
