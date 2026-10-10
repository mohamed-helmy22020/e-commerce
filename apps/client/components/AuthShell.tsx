import type { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
    return (
        <main className="flex flex-1 items-center justify-center bg-zinc-50/60 px-4 py-16 sm:px-6 lg:px-8 dark:bg-zinc-900/40">
            <div className="w-full max-w-md">{children}</div>
        </main>
    );
}
