import {
    ArrowRight,
    Headphones,
    RotateCcw,
    ShieldCheck,
    Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Newsletter } from "@/components/Newsletter";
import { ProductCard } from "@/components/ProductCard";
import { SiteFooter } from "@/components/SiteFooter";
import { categories, products } from "@/data/products";

const perks = [
    { icon: Truck, title: "Free shipping", copy: "On all orders over $75" },
    { icon: RotateCcw, title: "30-day returns", copy: "No questions asked" },
    { icon: ShieldCheck, title: "Secure checkout", copy: "256-bit encryption" },
    { icon: Headphones, title: "Real support", copy: "Humans, 7 days a week" },
];

export default function HomePage() {
    return (
        <>
            <main>
                {/* ───────────────────────── Hero ───────────────────────── */}
                <section className="relative overflow-hidden bg-zinc-50 dark:bg-zinc-900">
                    <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:py-24">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                New season drop — now live
                            </span>

                            <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl dark:text-zinc-50">
                                Everyday essentials,
                                <br />
                                <span className="text-zinc-400 dark:text-zinc-500">
                                    built to last.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Considered design, honest materials, and fair
                                prices. Pieces you&apos;ll reach for every
                                single day.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href="#featured"
                                    className="inline-flex h-12 items-center gap-2 rounded-full bg-zinc-900 px-7 text-sm font-medium text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                                >
                                    Shop the collection
                                    <ArrowRight className="size-4" />
                                </Link>
                                <Link
                                    href="#new"
                                    className="inline-flex h-12 items-center rounded-full border border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-zinc-400"
                                >
                                    Explore new in
                                </Link>
                            </div>

                            <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-700">
                                {[
                                    ["12k+", "Happy customers"],
                                    ["4.9★", "Average rating"],
                                    ["48h", "Fast delivery"],
                                ].map(([value, label]) => (
                                    <div key={label}>
                                        <dt className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                                            {value}
                                        </dt>
                                        <dd className="mt-1 text-xs text-zinc-500 sm:text-sm dark:text-zinc-400">
                                            {label}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>

                        {/* Image collage */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative aspect-3/4 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                                <Image
                                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=80"
                                    alt="Model wearing the new season collection"
                                    fill
                                    priority
                                    sizes="(min-width: 1024px) 25vw, 50vw"
                                    className="object-cover"
                                />
                            </div>
                            <div className="mt-12 space-y-4">
                                <div className="relative aspect-square overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                                    <Image
                                        src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80"
                                        alt="Leather backpack"
                                        fill
                                        sizes="(min-width: 1024px) 18vw, 40vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative aspect-4/5 overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                                    <Image
                                        src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80"
                                        alt="Automatic watch"
                                        fill
                                        sizes="(min-width: 1024px) 18vw, 40vw"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ───────────────────────── Perks ───────────────────────── */}
                <section className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                        {perks.map(({ icon: Icon, title, copy }) => (
                            <div key={title} className="flex items-start gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Icon className="size-4.5 text-zinc-900 dark:text-zinc-100" />
                                </span>
                                <div>
                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                        {title}
                                    </p>
                                    <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                                        {copy}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ───────────────────── Shop by category ───────────────────── */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between gap-6">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                                Shop by category
                            </h2>
                            <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                Find exactly what you&apos;re looking for.
                            </p>
                        </div>
                        <Link
                            href="#"
                            className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-900 hover:underline dark:text-zinc-100 sm:inline-flex"
                        >
                            View all <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={cat.href}
                                className="group relative block aspect-4/5 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800"
                            >
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-zinc-900/80 via-zinc-900/10 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                                    <div>
                                        <h3 className="text-base font-medium text-white">
                                            {cat.name}
                                        </h3>
                                        <p className="text-xs text-white/70">
                                            {cat.count} products
                                        </p>
                                    </div>
                                    <span className="flex size-9 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition group-hover:bg-white group-hover:text-zinc-900">
                                        <ArrowRight className="size-4" />
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* ───────────────────── Featured products ───────────────────── */}
                <section
                    id="featured"
                    className="border-t border-zinc-200 bg-zinc-50/60 py-20 dark:border-zinc-800 dark:bg-zinc-900/40"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
                                    Featured products
                                </h2>
                                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                                    Hand-picked favourites from this season.
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {["All", "New", "Sale"].map((tab, i) => (
                                    <button
                                        key={tab}
                                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                                            i === 0
                                                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                                                : "border border-zinc-200 bg-white text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-100 dark:hover:text-zinc-100"
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>

                        <div className="mt-14 flex justify-center">
                            <Link
                                href="#"
                                className="inline-flex h-12 items-center gap-2 rounded-full border border-zinc-300 bg-white px-7 text-sm font-medium text-zinc-900 transition hover:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-100"
                            >
                                View all products
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* ───────────────────────── Promo ───────────────────────── */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="grid overflow-hidden rounded-3xl bg-zinc-900 dark:bg-zinc-100 lg:grid-cols-2">
                        <div className="relative min-h-80px lg:min-h-115">
                            <Image
                                src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80"
                                alt="Autumn collection"
                                fill
                                sizes="(min-width: 1024px) 50vw, 100vw"
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col justify-center p-10 sm:p-14">
                            <span className="w-fit rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/80 dark:border-zinc-900/20 dark:text-zinc-700">
                                Limited time
                            </span>
                            <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl dark:text-zinc-900">
                                Up to 40% off
                                <br />
                                the autumn edit
                            </h2>
                            <p className="mt-5 max-w-md leading-relaxed text-zinc-400 dark:text-zinc-600">
                                Layer up for the season with our warmest knits,
                                coats, and boots — all marked down while stock
                                lasts.
                            </p>
                            <Link
                                href="#sale"
                                className="mt-8 inline-flex h-12 w-fit items-center gap-2 rounded-full bg-white px-7 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                            >
                                Shop the sale
                                <ArrowRight className="size-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                <Newsletter />
            </main>

            <SiteFooter />
        </>
    );
}
