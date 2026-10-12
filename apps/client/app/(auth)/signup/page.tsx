import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/AuthCard";
import { AuthDivider } from "@/components/AuthDivider";
import { GoogleAuthButton } from "@/components/GoogleAuthButton";
import { SignupForm } from "@/components/SignupForm";

export const metadata: Metadata = {
    title: "Create account — LUMEN",
    description: "Create your LUMEN account.",
};

export default function SignupPage() {
    return (
        <AuthCard
            title="Create your account"
            description="Join LUMEN for early access to drops and member pricing."
            footer={
                <>
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                    >
                        Sign in
                    </Link>
                </>
            }
        >
            <div className="flex flex-col gap-6">
                <GoogleAuthButton />
                <AuthDivider />
                <SignupForm />
            </div>
        </AuthCard>
    );
}
