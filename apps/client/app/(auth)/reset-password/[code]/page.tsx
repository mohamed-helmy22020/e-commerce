import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { AuthCard } from "@/components/AuthCard";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
    title: "Set a new password — LUMEN",
    description: "Choose a new password for your LUMEN account.",
};

type ResetPasswordPageProps = {
    params: Promise<{ code: string }>;
};

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    return (
        <AuthCard
            title="Set a new password"
            description="Choose a strong password for your LUMEN account."
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
            <Suspense fallback={<ResetPasswordFormSkeleton />}>
                <ResetPasswordFormContainer params={params} />
            </Suspense>
        </AuthCard>
    );
}

async function ResetPasswordFormContainer({ params }: ResetPasswordPageProps) {
    const { code } = await params;

    return <ResetPasswordForm token={code} />;
}

function ResetPasswordFormSkeleton() {
    return (
        <div aria-hidden className="flex flex-col gap-6">
            <div className="flex flex-col gap-5">
                {[0, 1].map((index) => (
                    <div key={index} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-28 rounded-full" />
                        <Skeleton className="h-12 w-full rounded-full" />
                    </div>
                ))}
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
        </div>
    );
}
