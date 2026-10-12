import { Skeleton } from "@/components/ui/skeleton";

/** Fallback for the settings pages while getCurrentUser() resolves. */
export function SettingsCardSkeleton() {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
                <Skeleton className="size-16 rounded-full" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-40 rounded-full" />
                    <Skeleton className="h-4 w-56 rounded-full" />
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-5">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4"
                    >
                        <Skeleton className="h-4 w-28 rounded-full" />
                        <Skeleton className="h-4 w-44 rounded-full" />
                    </div>
                ))}
            </div>
        </div>
    );
}
