import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** The elevated card shell shared by every settings page. */
export function SettingsCard({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900",
                className,
            )}
        >
            {children}
        </div>
    );
}
