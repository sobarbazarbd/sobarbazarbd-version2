import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Category } from "@/lib/api";
import type { ProductCardData } from "@/components/product/product-card";

const quickTabs = ["Latest", "Offer", "Shipment", "Collaboration", "Event", "Guideline", "Achievement", "Review", "Social Work"];

type CategoryGroupItem = {
  name: string;
  href: string;
};

type CategoryGroup = {
  title: string;
  items: CategoryGroupItem[];
};

const categoryGroups: CategoryGroup[] = [
  {
    title: "Shoes For All Occasions",
    items: [
      { name: "Sneakers", href: "/shop?category=shoes&search=sneakers" },
      { name: "Ladies Shoes", href: "/shop?category=shoes&search=ladies+shoes" },
      { name: "Formal Shoes", href: "/shop?category=shoes&search=formal+shoes" },
      { name: "High Heels", href: "/shop?category=shoes&search=heels" },
    ],
  },
  {
    title: "Huge Collection Of Bags",
    items: [
      { name: "Purse", href: "/shop?category=bags&search=purse" },
      { name: "Hand Bags", href: "/shop?category=bags&search=handbag" },
      { name: "Backpacks", href: "/shop?category=bags&search=backpack" },
      { name: "Wallet", href: "/shop?category=bags&search=wallet" },
    ],
  },
  {
    title: "Stylish Jewelry",
    items: [
      { name: "Necklace", href: "/shop?category=jewelry&search=necklace" },
      { name: "Earrings", href: "/shop?category=jewelry&search=earrings" },
      { name: "Rings", href: "/shop?category=jewelry&search=ring" },
      { name: "Bracelets", href: "/shop?category=jewelry&search=bracelet" },
    ],
  },
  {
    title: "Unique Watches",
    items: [
      { name: "Mens Watch", href: "/shop?category=watches&search=mens+watch" },
      { name: "Women Watch", href: "/shop?category=watches&search=womens+watch" },
      { name: "Smart Watch", href: "/shop?category=watches&search=smart+watch" },
      { name: "Pocket Watch", href: "/shop?category=watches&search=pocket+watch" },
    ],
  },
];

export function DealStrip({ products }: { products: ProductCardData[] }) {
  const items = products.slice(0, 7);
  if (!items.length) return null;

  return (
    <section className="container mt-3">
      <div className="grid gap-2 rounded-lg border bg-white p-3 sm:grid-cols-2 lg:grid-cols-7">
        {items.map((p, index) => (
          <Link
            key={p.id}
            href={p.href || `/product/${p.slug || p.id}`}
            className={index === 0 ? "group relative overflow-hidden rounded-md bg-[#f0fcff] p-3 sm:col-span-2 lg:col-span-2" : "group relative overflow-hidden rounded-md bg-neutral-50 p-3"}
          >
            <div className={index === 0 ? "relative h-36" : "relative h-24"}>
              <Image src={p.image || "/placeholder.png"} alt={p.name} fill className="object-contain transition group-hover:scale-105" sizes="220px" />
            </div>
            <span className="mt-2 line-clamp-2 block text-xs font-bold text-neutral-800">{p.name}</span>
            <span className="mt-1 inline-flex rounded-full bg-primary px-2 py-1 text-[11px] font-bold text-white">View Product</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function StoryTabs() {
  return (
    <section className="container mt-3">
      <div className="flex gap-2 overflow-x-auto bg-white p-2 scrollbar-none">
        {quickTabs.map((tab) => (
          <Link
            key={tab}
            href="/shop"
            className="shrink-0 rounded-full border bg-white px-3 py-1.5 text-[11px] font-semibold text-neutral-600 hover:border-primary hover:text-primary"
          >
            {tab}
          </Link>
        ))}
      </div>
    </section>
  );
}

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  return (
    <section className="container mt-3">
      <div className="grid gap-2 bg-white p-2 sm:grid-cols-2 xl:grid-cols-4">
        {categoryGroups.map((group, groupIndex) => (
          <div key={group.title} className="border bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-sky-dark">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item, itemIndex) => {
                const cat = categories[(groupIndex * 4 + itemIndex) % Math.max(categories.length, 1)];
                return (
                  <Link key={item.name} href={item.href} className="group overflow-hidden rounded-md bg-neutral-50 p-2 text-center">
                    <div className="relative mx-auto mb-2 h-20 w-full overflow-hidden rounded bg-white">
                      {cat?.image_url || cat?.image ? (
                        <Image
                          src={cat.image_url || cat.image || ""}
                          alt={item.name}
                          fill
                          className="object-cover transition group-hover:scale-105"
                          sizes="140px"
                        />
                      ) : (
                        <div className="grid h-full place-items-center bg-sky-light text-primary">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-600">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BrandStrip() {
  const brands = ["Sobarbazar", "SobarOne", "SobarShip", "SobarX"];
  return (
    <section className="container mt-6">
      <div className="bg-white px-4 py-8 text-center">
        <h2 className="text-sm font-bold text-neutral-700">Explore Sobarbazar Brands... Think for Everyone.</h2>
        <div className="mx-auto mt-4 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
          {brands.map((brand, index) => (
            <Link key={brand} href="/" className="grid h-14 place-items-center rounded-md bg-sky-light px-4 text-lg font-black text-primary">
              <span className={index === 1 ? "text-orange-500" : ""}>{brand}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
