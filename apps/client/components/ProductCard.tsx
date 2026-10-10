import type { Product } from "@/data/products";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
    const discount = product.compareAt
        ? Math.round(
              ((product.compareAt - product.price) / product.compareAt) * 100,
          )
        : 0;

    return (
        <div className="group">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {product.badge && (
                        <span className="w-fit rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-zinc-900 backdrop-blur dark:bg-zinc-900/90 dark:text-zinc-100">
                            {product.badge}
                        </span>
                    )}
                </div>

                {discount > 0 && (
                    <span className="absolute right-3 top-3 rounded-full bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                        −{discount}%
                    </span>
                )}

                <button className="absolute inset-x-3 bottom-3 translate-y-3 rounded-xl bg-white/95 py-2.5 text-sm font-medium text-zinc-900 opacity-0 backdrop-blur transition-all duration-300 hover:bg-zinc-900 hover:text-white group-hover:translate-y-0 group-hover:opacity-100 dark:bg-zinc-900/95 dark:text-zinc-100 dark:hover:bg-zinc-100 dark:hover:text-zinc-900">
                    Add to cart
                </button>
            </div>

            <div className="mt-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <Star className="size-3.5 fill-zinc-900 text-zinc-900 dark:fill-zinc-100 dark:text-zinc-100" />
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                        {product.rating}
                    </span>
                    <span>({product.reviews})</span>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span>{product.category}</span>
                </div>

                <h3 className="text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100">
                    <Link
                        href={`/products/${product.id}`}
                        className="hover:underline"
                    >
                        {product.name}
                    </Link>
                </h3>

                <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            ${product.price}
                        </span>
                        {product.compareAt && (
                            <span className="text-xs text-zinc-400 line-through dark:text-zinc-500">
                                ${product.compareAt}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        {product.colors.map((color) => (
                            <span
                                key={color}
                                style={{ backgroundColor: color }}
                                className="size-3 rounded-full ring-1 ring-zinc-300 ring-offset-1 ring-offset-white dark:ring-zinc-700 dark:ring-offset-zinc-950"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
