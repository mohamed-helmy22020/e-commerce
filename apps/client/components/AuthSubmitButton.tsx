import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AuthSubmitButton({
    className,
    asChild,
    ...props
}: ComponentProps<typeof Button>) {
    return (
        <Button
            asChild={asChild}
            type={asChild ? undefined : "submit"}
            className={cn(
                "h-12 w-full rounded-full bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300",
                className,
            )}
            {...props}
        />
    );
}
