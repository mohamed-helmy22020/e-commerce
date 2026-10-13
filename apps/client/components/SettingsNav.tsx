"use client";

import { Pencil, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
    { label: "Profile", href: "/settings", icon: UserRound },
    { label: "Edit profile", href: "/settings/edit", icon: Pencil },
    { label: "Security", href: "/settings/security", icon: ShieldCheck },
];

export function SettingsNav() {
    const pathname = usePathname();

    return (
        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {links.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;

                return (
                    <Link
                        key={href}
                        href={href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                            "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                            active
                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                        )}
                    >
                        <Icon className="size-4" />
                        {label}
                    </Link>
                );
            })}
        </nav>
    );
}
