// data/products.ts
export type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    compareAt?: number;
    image: string;
    badge?: string;
    rating: number;
    reviews: number;
    colors: string[];
};

export const products: Product[] = [
    {
        id: "1",
        name: "Meridian Automatic Watch",
        category: "Accessories",
        price: 189,
        compareAt: 240,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
        badge: "Best seller",
        rating: 4.8,
        reviews: 214,
        colors: ["#1c1917", "#a8a29e", "#78716c"],
    },
    {
        id: "2",
        name: "Cloudstep Runner",
        category: "Footwear",
        price: 129,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80",
        badge: "New",
        rating: 4.6,
        reviews: 98,
        colors: ["#dc2626", "#18181b", "#f4f4f5"],
    },
    {
        id: "3",
        name: "Studio Over-Ear Headphones",
        category: "Electronics",
        price: 249,
        compareAt: 299,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
        rating: 4.9,
        reviews: 431,
        colors: ["#27272a", "#e4e4e7"],
    },
    {
        id: "4",
        name: "Voyager Leather Backpack",
        category: "Bags",
        price: 175,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=80",
        rating: 4.7,
        reviews: 156,
        colors: ["#78350f", "#1c1917"],
    },
    {
        id: "5",
        name: "Solstice Sunglasses",
        category: "Accessories",
        price: 95,
        compareAt: 120,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=80",
        rating: 4.5,
        reviews: 87,
        colors: ["#18181b", "#78350f", "#d4d4d8"],
    },
    {
        id: "6",
        name: "Heritage Field Camera",
        category: "Electronics",
        price: 540,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&q=80",
        badge: "Limited",
        rating: 4.9,
        reviews: 62,
        colors: ["#292524", "#a8a29e"],
    },
    {
        id: "7",
        name: "Everyday Cotton Tee",
        category: "Apparel",
        price: 38,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=900&q=80",
        rating: 4.4,
        reviews: 312,
        colors: ["#fafafa", "#18181b", "#0f766e"],
    },
    {
        id: "8",
        name: "Noir Eau de Parfum",
        category: "Beauty",
        price: 110,
        compareAt: 140,
        image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=900&q=80",
        badge: "Sale",
        rating: 4.7,
        reviews: 189,
        colors: ["#1c1917"],
    },
];

export const categories = [
    {
        name: "Apparel",
        count: 128,
        href: "#apparel",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80",
    },
    {
        name: "Footwear",
        count: 64,
        href: "#footwear",
        image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=900&q=80",
    },
    {
        name: "Accessories",
        count: 92,
        href: "#accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&q=80",
    },
    {
        name: "Electronics",
        count: 41,
        href: "#electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&q=80",
    },
];
