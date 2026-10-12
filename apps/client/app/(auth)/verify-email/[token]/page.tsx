import { BadgeCheck, TriangleAlert } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/AuthCard";
import { AuthSubmitButton } from "@/components/AuthSubmitButton";
import { verifyEmail } from "@/lib/actions/auth-actions";

// Verifying calls the backend during render, so this segment is allowed to
// block a navigation instead of validating for an instant shell.
export const instant = false;

export const metadata: Metadata = {
    title: "Verify email — LUMEN",
    description: "Confirm your LUMEN email address.",
};

type VerifyEmailPageProps = {
    params: Promise<{ token: string }>;
};

export default async function VerifyEmailPage({
    params,
}: VerifyEmailPageProps) {
    const { token } = await params;
    const result = await verifyEmail(token);

    const alreadyVerified =
        !result.ok && /already verified/i.test(result.message);
    const verified = result.ok || alreadyVerified;

    if (verified) {
        return (
            <AuthCard
                title="Email verified"
                description="Thanks for confirming your email address."
                footer={
                    <>
                        Need a different account?{" "}
                        <Link
                            href="/signup"
                            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                        >
                            Create one
                        </Link>
                    </>
                }
            >
                <div className="flex flex-col items-center gap-6 text-center">
                    <span className="flex size-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-500/10">
                        <BadgeCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </span>

                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {alreadyVerified
                            ? "This email address was already verified. You can sign in to continue."
                            : "Your email address has been verified. You can now sign in to continue."}
                    </p>

                    <div className="w-full">
                        <AuthSubmitButton asChild>
                            <Link href="/login">Sign in</Link>
                        </AuthSubmitButton>
                    </div>
                </div>
            </AuthCard>
        );
    }

    return (
        <AuthCard
            title="Verification failed"
            description="We couldn't verify this email address."
            footer={
                <>
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <div className="flex flex-col items-center gap-6 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
                    <TriangleAlert className="size-5 text-destructive" />
                </span>

                <div className="space-y-2">
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        {result.message}
                    </p>
                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        The link may have expired or already been used. Sign in
                        to request a new verification email.
                    </p>
                </div>

                <div className="flex w-full flex-col gap-3">
                    <AuthSubmitButton asChild>
                        <Link href="/login">Back to sign in</Link>
                    </AuthSubmitButton>
                    <Link
                        href="/signup"
                        className="text-sm font-medium text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                        Create an account
                    </Link>
                </div>
            </div>
        </AuthCard>
    );
}
