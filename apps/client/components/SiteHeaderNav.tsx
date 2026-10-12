"use client";

import { LogOut, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { logout } from "@/lib/actions/auth-actions";
import { useUserStore } from "@/stores/user.store";
import { useShallow } from "zustand/react/shallow";
import { UserMenu } from "./UserMenu";
import { ModeToggle } from "./ui/ModeToggle";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

const navLinks = [
    { label: "New In", href: "#new" },
    { label: "Apparel", href: "#apparel" },
    { label: "Footwear", href: "#footwear" },
    { label: "Accessories", href: "#accessories" },
    { label: "Sale", href: "#sale" },
];

type SiteHeaderNavProps = {
    /**
     * `undefined` while the session is resolving, `null` when signed out, or
     * the signed-in user.
     */
    user?: User | null;
};

export function SiteHeaderNav({ user }: SiteHeaderNavProps) {
    const [open, setOpen] = useState(false);
    const cartCount = 2;
    const { setUser } = useUserStore(
        useShallow((state) => ({
            setUser: state.setUser,
        })),
    );

    useEffect(() => {
        if (user === undefined) return;
        setUser(user);
    }, [user]);

    return (
        <>
            {/* Announcement bar — inverts in dark mode to stay visually distinct */}
            {/* <div className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <p className="mx-auto max-w-7xl px-4 py-2 text-center text-xs tracking-wide sm:text-sm">
                    Free shipping over $75 · 30-day returns · Carbon-neutral
                    delivery
                </p>
            </div> */}

            <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80">
                <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(true)}
                        aria-label="Open menu"
                        className="-ml-2 rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 lg:hidden"
                    >
                        <Menu className="size-5" />
                    </Button>

                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-[0.2em] text-zinc-900 dark:text-zinc-100"
                    >
                        LUMEN
                    </Link>

                    <nav className="ml-8 hidden items-center gap-7 lg:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="relative text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="ml-auto flex items-center gap-1">
                        <div className="relative hidden md:block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="search"
                                placeholder="Search products…"
                                className="h-10 w-56 rounded-full border border-zinc-200 bg-zinc-50 pl-9 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600 dark:focus:bg-zinc-900 lg:w-64"
                            />
                        </div>

                        <button
                            aria-label="Search"
                            className="rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800 md:hidden"
                        >
                            <Search className="size-5" />
                        </button>

                        <ModeToggle />

                        {user === undefined ? (
                            <Skeleton className="size-9 rounded-lg" />
                        ) : user ? (
                            <UserMenu user={user} />
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    aria-label="Sign in"
                                    className="rounded-lg p-2 transition hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800"
                                >
                                    <User className="size-5" />
                                </Link>

                                <Link
                                    href="/login"
                                    className="hidden h-9 items-center rounded-full px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 lg:inline-flex dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                                >
                                    Sign in
                                </Link>

                                <Link
                                    href="/signup"
                                    className="hidden h-9 items-center rounded-full bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-700 lg:inline-flex dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}

                        <button
                            aria-label="Cart"
                            className="relative rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <ShoppingBag className="size-5" />
                            <span className="absolute -right-0.5 -top-0.5 flex size-4.5 min-w-[4.5] items-center justify-center rounded-full bg-zinc-900 px-1 text-[10px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-60 lg:hidden ${
                    open ? "pointer-events-auto" : "pointer-events-none"
                }`}
            >
                <div
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/60 ${
                        open ? "opacity-100" : "opacity-0"
                    }`}
                />
                <aside
                    className={`absolute inset-y-0 left-0 flex w-80 max-w-[85%] flex-col bg-white p-6 shadow-xl transition-transform duration-300 dark:bg-zinc-900 ${
                        open ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold tracking-[0.2em]">
                            LUMEN
                        </span>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Close menu"
                            className="rounded-lg p-2 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <X className="size-5" />
                        </button>
                    </div>

                    <nav className="mt-8 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className="rounded-lg px-3 py-3 text-base font-medium text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-6 flex flex-col gap-3">
                        {user ? (
                            <>
                                <div className="rounded-2xl border border-zinc-200 px-4 py-3 dark:border-zinc-800">
                                    <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                                        {user.email}
                                    </p>
                                </div>
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-400"
                                    >
                                        <LogOut className="size-4" />
                                        Sign out
                                    </button>
                                </form>
                            </>
                        ) : user === null ? (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-400"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setOpen(false)}
                                    className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                >
                                    Create account
                                </Link>
                            </>
                        ) : null}
                    </div>

                    <div className="mt-auto border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                        <p>Need help?</p>
                        <a
                            href="mailto:help@lumen.com"
                            className="text-zinc-900 underline dark:text-zinc-100"
                        >
                            help@lumen.com
                        </a>
                    </div>
                </aside>
            </div>
        </>
    );
}
