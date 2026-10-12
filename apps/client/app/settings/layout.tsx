import type { ReactNode } from "react";

import { SettingsNav } from "@/components/SettingsNav";
import { SiteFooter } from "@/components/SiteFooter";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <main className="flex-1 bg-zinc-50/60 dark:bg-zinc-900/40">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <header>
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                            Settings
                        </h1>
                        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                            Manage your profile and account details.
                        </p>
                    </header>

                    <div className="mt-10 grid gap-8 lg:grid-cols-[220px_1fr]">
                        <SettingsNav />
                        <div className="min-w-0">{children}</div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </>
    );
}
