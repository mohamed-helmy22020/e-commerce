import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
    title: "Sign in — LUMEN",
    description: "Sign in to your LUMEN account.",
};

export default function LoginPage() {
    return (
        <AuthCard
            title="Welcome back"
            description="Sign in to your LUMEN account to continue."
            footer={
                <>
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
                    >
                        Create one
                    </Link>
                </>
            }
        >
            <LoginForm />
        </AuthCard>
    );
}
