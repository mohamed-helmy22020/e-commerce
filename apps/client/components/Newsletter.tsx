"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [done, setDone] = useState(false);

    return (
        <section className="bg-zinc-900 dark:bg-zinc-100">
            <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl dark:text-zinc-900">
                    Get 10% off your first order
                </h2>
                <p className="mx-auto mt-4 max-w-md text-zinc-400 dark:text-zinc-600">
                    Join the list for early access to drops, restocks, and
                    members-only pricing. No spam, ever.
                </p>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (email) setDone(true);
                    }}
                    className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
                >
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="h-12 flex-1 rounded-full border border-zinc-700 bg-zinc-800/60 px-5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 dark:border-zinc-300 dark:bg-white dark:text-zinc-900 dark:placeholder:text-zinc-400 dark:focus:border-zinc-900"
                    />
                    <button
                        type="submit"
                        disabled={done}
                        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-70 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                    >
                        {done ? (
                            <>
                                <Check className="size-4" /> Subscribed
                            </>
                        ) : (
                            <>
                                Subscribe <ArrowRight className="size-4" />
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-500">
                    By subscribing you agree to our Privacy Policy.
                </p>
            </div>
        </section>
    );
}
