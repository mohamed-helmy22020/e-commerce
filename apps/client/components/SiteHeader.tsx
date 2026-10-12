import { Suspense } from "react";

import { getCurrentUser } from "@/lib/auth";
import { SiteHeaderNav } from "./SiteHeaderNav";

export function SiteHeader() {
    return (
        <Suspense fallback={<SiteHeaderNav />}>
            <SiteHeaderAuth />
        </Suspense>
    );
}

async function SiteHeaderAuth() {
    const user = await getCurrentUser();
    return <SiteHeaderNav user={user} />;
}
