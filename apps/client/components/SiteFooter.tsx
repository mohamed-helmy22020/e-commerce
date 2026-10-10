import Link from "next/link";

const columns = [
    {
        title: "Shop",
        links: ["New Arrivals", "Apparel", "Footwear", "Accessories", "Sale"],
    },
    {
        title: "Company",
        links: ["About Us", "Sustainability", "Careers", "Press", "Stores"],
    },
    {
        title: "Support",
        links: [
            "Help Center",
            "Shipping",
            "Returns",
            "Size Guide",
            "Contact Us",
        ],
    },
];

export async function SiteFooter() {
    "use cache";
    return (
        <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
                    <div>
                        <span className="text-lg font-semibold tracking-[0.2em]">
                            LUMEN
                        </span>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                            Thoughtfully designed essentials, made from durable
                            and responsibly sourced materials.
                        </p>
                        <div className="mt-6 flex gap-2">
                            {["Instagram", "Twitter", "YouTube"].map((s) => (
                                <a
                                    key={s}
                                    href="#"
                                    className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                                >
                                    {s}
                                </a>
                            ))}
                        </div>
                    </div>

                    {columns.map((col) => (
                        <div key={col.title}>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                {col.title}
                            </h3>
                            <ul className="mt-4 space-y-3">
                                {col.links.map((link) => (
                                    <li key={link}>
                                        <Link
                                            href="#"
                                            className="text-sm text-zinc-500 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                        >
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800 sm:flex-row">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                        © {new Date().getFullYear()} Lumen. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-zinc-500 dark:text-zinc-500">
                        <Link
                            href="#"
                            className="hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Privacy
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Terms
                        </Link>
                        <Link
                            href="#"
                            className="hover:text-zinc-900 dark:hover:text-zinc-100"
                        >
                            Cookies
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
