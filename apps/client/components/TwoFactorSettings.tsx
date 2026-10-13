"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy, Loader2, ShieldCheck } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
    startTwoFactorSetup,
    verifyTwoFactor,
} from "@/lib/actions/auth-actions";
import {
    twoFactorCodeSchema,
    type TwoFactorCodeValues,
} from "@/lib/authSchema";
import { useUserStore } from "@/stores/user.store";

/** Group the base32 secret into readable chunks (e.g. "abcd efgh ..."). */
function formatSecret(secret: string) {
    return secret.match(/.{1,4}/g)?.join(" ") ?? secret;
}

export function TwoFactorSettings({ user }: { user: User }) {
    const [enabled, setEnabled] = useState(user.twoFactorEnabled);
    const [starting, setStarting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [setup, setSetup] = useState<{
        otpauthURI: string;
        secret: string;
    } | null>(null);

    const { setUser } = useUserStore(
        useShallow((state) => ({ setUser: state.setUser })),
    );

    const form = useForm<TwoFactorCodeValues>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: { code: "" },
        mode: "onTouched",
    });

    const handleStart = async () => {
        setStarting(true);
        const result = await startTwoFactorSetup();
        setStarting(false);

        if (!result.ok) {
            toast.error(result.message);
            return;
        }

        setSetup({
            otpauthURI: result.data.otpauthURI,
            secret: result.data.secret,
        });
    };

    const handleCopy = async () => {
        if (!setup) return;
        try {
            await navigator.clipboard.writeText(setup.secret);
            setCopied(true);
            toast.success("Setup key copied");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Couldn't copy the setup key");
        }
    };

    const onSubmit = async (values: TwoFactorCodeValues) => {
        setVerifying(true);
        setVerifyError(null);
        try {
            const result = await verifyTwoFactor(values.code);
            if (!result.ok) {
                setVerifyError(result.message);
                toast.error(result.message);
                return;
            }

            setEnabled(true);
            setSetup(null);
            // Keep the client mirror in sync with the server (source of truth).
            setUser({ ...user, twoFactorEnabled: true });
            toast.success(result.data.message);
        } catch {
            const message = "Something went wrong verifying the code.";
            setVerifyError(message);
            toast.error(message);
        } finally {
            setVerifying(false);
        }
    };

    if (enabled) {
        return (
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
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
            </div>
        );
    }

    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <header>
                <h2 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Two-factor authentication
                </h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {setup
                        ? "Scan the QR code with your authenticator app, then enter the 6-digit code it shows."
                        : "Add a second step to sign-in. You'll use a 6-digit code from an authenticator app such as Google Authenticator or 1Password."}
                </p>
            </header>

            {!setup ? (
                <div className="mt-6">
                    <AuthSubmitButton
                        type="button"
                        onClick={handleStart}
                        disabled={starting}
                        className="w-full sm:w-auto"
                    >
                        {starting ? (
                            <>
                                <Loader2 className="me-2 size-4 animate-spin" />
                                Starting
                            </>
                        ) : (
                            "Enable two-factor authentication"
                        )}
                    </AuthSubmitButton>
                </div>
            ) : (
                <div className="mt-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                        <div className="w-fit rounded-2xl border border-zinc-200 bg-white p-4">
                            <QRCodeSVG
                                value={setup.otpauthURI}
                                size={168}
                                level="M"
                                marginSize={0}
                                title="Two-factor authentication QR code"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                Can&apos;t scan the code?
                            </p>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Enter this setup key in your authenticator app
                                instead.
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <code className="min-w-0 flex-1 truncate rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100">
                                    {formatSecret(setup.secret)}
                                </code>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    aria-label="Copy setup key"
                                    onClick={handleCopy}
                                    className="size-10 shrink-0 rounded-full border-zinc-300 bg-white text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100"
                                >
                                    {copied ? (
                                        <Check className="size-4" />
                                    ) : (
                                        <Copy className="size-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        noValidate
                        className="border-t border-zinc-200 pt-6 dark:border-zinc-800"
                    >
                        <FieldGroup className="gap-5">
                            <AuthField
                                control={form.control}
                                name="code"
                                label="Verification code"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                autoComplete="one-time-code"
                                placeholder="123456"
                            />
                        </FieldGroup>

                        {verifyError ? (
                            <p
                                role="alert"
                                aria-live="polite"
                                className="mt-4 text-sm text-destructive"
                            >
                                {verifyError}
                            </p>
                        ) : null}

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={verifying}
                                onClick={() => {
                                    setSetup(null);
                                    setVerifyError(null);
                                    form.reset();
                                }}
                                className="h-12 rounded-full border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100"
                            >
                                Cancel
                            </Button>
                            <AuthSubmitButton
                                className="w-full sm:w-auto"
                                disabled={verifying}
                            >
                                {verifying ? (
                                    <>
                                        <Loader2 className="me-2 size-4 animate-spin" />
                                        Verifying
                                    </>
                                ) : (
                                    "Verify and enable"
                                )}
                            </AuthSubmitButton>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
