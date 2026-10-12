import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { ProfileForm } from "@/components/ProfileForm";
import { SettingsCardSkeleton } from "@/components/SettingsCardSkeleton";
import { getCurrentUser } from "@/lib/actions/user.actions";

export const metadata: Metadata = {
    title: "Edit profile — LUMEN",
    description: "Change your LUMEN account details.",
};

export default function EditProfilePage() {
    return (
        <Suspense fallback={<SettingsCardSkeleton />}>
            <EditProfileContent />
        </Suspense>
    );
}

async function EditProfileContent() {
    const user = await getCurrentUser();
    if (!user) redirect("/login");

    return <ProfileForm user={user} />;
}
