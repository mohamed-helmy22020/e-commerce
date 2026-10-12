"use client";

import { LogOut, User as UserIcon } from "lucide-react";

import { logout } from "@/lib/actions/auth-actions";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function UserMenu({ user }: { user: User }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Account menu"
                    className="flex size-9 items-center justify-center rounded-lg text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                >
                    <UserIcon className="size-5" />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col gap-0.5 py-1.5">
                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {user.name}
                    </span>
                    <span className="truncate text-xs font-normal text-zinc-500 dark:text-zinc-400">
                        {user.email}
                    </span>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <form action={logout}>
                    <DropdownMenuItem asChild>
                        <button type="submit" className="w-full cursor-pointer">
                            <LogOut />
                            Sign out
                        </button>
                    </DropdownMenuItem>
                </form>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
