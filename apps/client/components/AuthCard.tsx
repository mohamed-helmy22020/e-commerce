import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
    title: string;
    description: string;
    children: ReactNode;
    footer?: ReactNode;
};

export function AuthCard({
    title,
    description,
    children,
    footer,
}: AuthCardProps) {
    return (
        <div>
            <div className="flex flex-col items-center text-center">
                <Link
                    href="/"
                    className="text-lg font-semibold tracking-[0.2em] text-zinc-900 transition hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
                >
                    LUMEN
                </Link>
                <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {description}
                </p>
            </div>

            <div className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
                {children}
            </div>

            {footer ? (
                <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    {footer}
                </p>
            ) : null}
        </div>
    );
}
