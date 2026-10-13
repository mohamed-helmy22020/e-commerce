"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthField } from "@/components/AuthField";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { SecondaryButton } from "@/components/SecondaryButton";
import { SettingsCard } from "@/components/SettingsCard";
import { TwoFactorSetupKey } from "@/components/TwoFactorSetupKey";
import { FieldError, FieldGroup } from "@/components/ui/field";
import {
    startTwoFactorSetup,
    verifyTwoFactor,
} from "@/lib/actions/auth-actions";
import {
    twoFactorCodeSchema,
    type TwoFactorCodeValues,
} from "@/lib/authSchema";

type TwoFactorSetup = {
    otpauthURI: string;
    secret: string;
};

/** Two-factor setup: start it, scan the key, then verify a code to enable. */
export function TwoFactorSetupCard({ onEnabled }: { onEnabled: () => void }) {
    const [starting, setStarting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [setup, setSetup] = useState<TwoFactorSetup | null>(null);

    const form = useForm<TwoFactorCodeValues>({
        resolver: zodResolver(twoFactorCodeSchema),
        defaultValues: { code: "" },
        mode: "onTouched",
    });

    const handleStart = async () => {
        setStarting(true);
        try {
            const result = await startTwoFactorSetup();
            if (!result.ok) {
                toast.error(result.message);
                return;
            }

            setSetup({
                otpauthURI: result.data.otpauthURI,
                secret: result.data.secret,
            });
        } catch {
            toast.error("Something went wrong starting two-factor setup.");
        } finally {
            setStarting(false);
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

            toast.success(result.data.message);
            onEnabled();
        } catch {
            const message = "Something went wrong verifying the code.";
            setVerifyError(message);
            toast.error(message);
        } finally {
            setVerifying(false);
        }
    };

    const cancelSetup = () => {
        setSetup(null);
        setVerifyError(null);
        form.reset();
    };

    return (
        <SettingsCard>
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
                    <TwoFactorSetupKey
                        otpauthURI={setup.otpauthURI}
                        secret={setup.secret}
                    />

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

                        <FieldError
                            className="mt-4"
                            errors={
                                verifyError
                                    ? [{ message: verifyError }]
                                    : undefined
                            }
                        />

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <SecondaryButton
                                type="button"
                                disabled={verifying}
                                onClick={cancelSetup}
                            >
                                Cancel
                            </SecondaryButton>
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
        </SettingsCard>
    );
}
