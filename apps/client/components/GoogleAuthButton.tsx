"use client";

import { GoogleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function GoogleAuthButton() {
    // The callback route redirects back to /login?error=google when the
    // handshake fails; surface it as a toast and clean the URL.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("error") !== "google") return;

        toast.error("Couldn't sign in with Google. Please try again.");

        params.delete("error");
        const query = params.toString();
        window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${query ? `?${query}` : ""}`,
        );
    }, []);

    return (
        <Button
            asChild
            variant="outline"
            className="h-12 w-full justify-center gap-2 rounded-full border-zinc-300 bg-white text-sm font-medium text-zinc-900 transition hover:border-zinc-900 hover:bg-white dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100 dark:hover:bg-zinc-900"
        >
            <a href="/auth/google">
                <HugeiconsIcon icon={GoogleIcon} className="size-5" />
                Continue with Google
            </a>
        </Button>
    );
}
