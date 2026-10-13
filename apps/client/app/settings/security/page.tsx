import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { SettingsCardSkeleton } from "@/components/SettingsCardSkeleton";
import { TwoFactorSettings } from "@/components/TwoFactorSettings";
import { getCurrentUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
    title: "Security — LUMEN",
    description: "Manage two-factor authentication for your LUMEN account.",
};

export default function SecuritySettingsPage() {
    return (
        <Suspense fallback={<SettingsCardSkeleton />}>
            <SecurityContent />
        </Suspense>
    );
}

async function SecurityContent() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return <TwoFactorSettings user={user} />;
}
