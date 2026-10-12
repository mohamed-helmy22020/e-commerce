import { BadgeCheck, CalendarDays, Mail, UserRound } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
    ADMIN: "Administrator",
    USER: "Customer",
};

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";

    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";

    return `${first}${last}`.toUpperCase();
}

function formatDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

function StatusPill({
    on,
    off,
    value,
}: {
    on: string;
    off: string;
    value: boolean;
}) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
            <span
                className={cn(
                    "size-1.5 rounded-full",
                    value ? "bg-emerald-500" : "bg-zinc-400 dark:bg-zinc-500",
                )}
            />
            {value ? on : off}
        </span>
    );
}

export function ProfileView({ user }: { user: User }) {
    const rows = [
        { label: "Full name", value: user.name, icon: UserRound },
        { label: "Email address", value: user.email, icon: Mail },
        {
            label: "Role",
            value: roleLabels[user.role] ?? user.role,
            icon: BadgeCheck,
        },
        {
            label: "Member since",
            value: formatDate(user.created_at),
            icon: CalendarDays,
        },
    ];

    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-lg font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                        {getInitials(user.name)}
                    </span>
                    <div className="min-w-0">
                        <p className="truncate text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                            {user.name}
                        </p>
                        <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                            {user.email}
                        </p>
                    </div>
                </div>

                <Link
                    href="/settings/edit"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-zinc-300 bg-white px-6 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 sm:self-auto dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-400"
                >
                    Edit profile
                </Link>
            </div>

            <dl className="mt-8 divide-y divide-zinc-200 border-t border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
                {rows.map(({ label, value, icon: Icon }) => (
                    <div
                        key={label}
                        className="flex items-start justify-between gap-4 py-4"
                    >
                        <dt className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                            <Icon className="size-4" />
                            {label}
                        </dt>
                        <dd className="text-end text-sm font-medium break-all text-zinc-900 dark:text-zinc-100">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-2">
                <StatusPill
                    value={user.isEmailVerified}
                    on="Email verified"
                    off="Email not verified"
                />
                <StatusPill
                    value={user.twoFactorEnabled}
                    on="Two-factor on"
                    off="Two-factor off"
                />
            </div>
        </div>
    );
}
