import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** The outline CTA from the design system (secondary button). */
export function SecondaryButton({
    className,
    ...props
}: ComponentProps<typeof Button>) {
    return (
        <Button
            variant="outline"
            className={cn(
                "h-12 rounded-full border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100",
                className,
            )}
            {...props}
        />
    );
}
