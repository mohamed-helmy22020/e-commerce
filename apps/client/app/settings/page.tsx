import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ProfileView } from "@/components/ProfileView";
import { SettingsCardSkeleton } from "@/components/SettingsCardSkeleton";
import { getCurrentUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
    title: "Profile — LUMEN",
    description: "Your LUMEN account details.",
};

export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsCardSkeleton />}>
            <ProfileContent />
        </Suspense>
    );
}

async function ProfileContent() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return <ProfileView user={user} />;
}
