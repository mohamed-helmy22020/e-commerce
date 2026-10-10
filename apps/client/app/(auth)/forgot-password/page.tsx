import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/AuthCard";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Reset password — LUMEN",
    description: "Reset your LUMEN account password.",
};

export default function ForgotPasswordPage() {
    return (
        <AuthCard
            title="Reset your password"
            description="Enter the email tied to your account and we'll send a reset link."
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
            <ForgotPasswordForm />
        </AuthCard>
    );
}
