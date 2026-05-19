import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles, Store as StoreIcon } from "lucide-react";
import type { Category } from "@/lib/api";
import type { ProductCardData } from "@/components/product/product-card";

const quickTabs = ["Latest", "Offer", "Shipment", "Collaboration", "Event", "Guideline", "Achievement", "Review", "Social Work"];

type VendorStore = {
  id: number | string;
  name: string;
  slug?: string;
  logo?: string;
  banner?: string;
  description?: string;
};

const categoryGroups = [
  { title: "Shoes For All Occasions", items: ["Sneakers", "Ladies Shoes", "Formal Shoes", "High Heels"] },
  { title: "Huge Collection Of Bags", items: ["Purse", "Hand Bags", "Backpacks", "Wallet"] },
  { title: "Stylish Jewelry", items: ["Necklace", "Earrings", "Rings", "Bracelets"] },
  { title: "Unique Watches", items: ["Mens Watch", "Women Watch", "Smart Watch", "Pocket Watch"] },
];

export function VendorStoreStrip({ stores, products }: { stores: VendorStore[]; products: ProductCardData[] }) {
  const fallbackStores: VendorStore[] = products.slice(0, 8).map((p) => ({
    id: p.id,
    name: p.storeName || p.name,
    logo: p.image,
    banner: p.image,
    description: "Popular seller on SobarbazarBD",
  }));
  const items = (stores.length ? stores : fallbackStores).slice(0, 10);
  if (!items.length) return null;

  return (
    <section className="container mt-3">
      <div className="overflow-hidden rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-sky-dark">Top Vendor Stores</h2>
            <p className="text-xs text-neutral-500">Trusted sellers, fast shopping, easy order</p>
          </div>
          <Link href="/stores" className="hidden items-center gap-1 rounded-full border border-primary px-3 py-1.5 text-xs font-bold text-primary sm:flex">
            View All Stores <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex min-h-[190px] items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
          {items.map((store, index) => {
            const image = store.banner || store.logo || "/placeholder.png";
            const featured = index === 2 || index === 3;
            return (
              <Link
                key={`${store.id}-${index}`}
                href="/stores"
                className={[
                  "group relative shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg",
                  featured ? "h-[190px] w-[380px]" : "h-[155px] w-[255px]",
                ].join(" ")}
              >
                <div className="relative h-[68%] bg-sky-light">
                  <Image src={image} alt={store.name} fill className="object-cover transition group-hover:scale-105" sizes={featured ? "380px" : "255px"} />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] font-black text-primary">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2">
                  <span className="-mt-7 grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow">
                    {store.logo ? (
                      <Image src={store.logo} alt={store.name} width={56} height={56} className="h-full w-full object-cover" />
                    ) : (
                      <StoreIcon className="h-7 w-7 text-primary" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 truncate text-sm font-black text-neutral-900">
                      {store.name} <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
                    </span>
                    <span className="line-clamp-1 text-[11px] text-neutral-500">{store.description || "Shop this vendor"}</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function DealStrip({ products }: { products: ProductCardData[] }) {
  const items = products.slice(0, 7);
  if (!items.length) return null;

  return (
    <section className="container mt-3">
      <div className="grid gap-2 rounded-lg border bg-white p-3 lg:grid-cols-7">
        {items.map((p, index) => (
          <Link key={p.id} href={p.href || `/product/${p.slug || p.id}`} className={index === 0 ? "group relative overflow-hidden rounded-md bg-[#f0fcff] p-3 lg:col-span-2" : "group relative overflow-hidden rounded-md bg-neutral-50 p-3"}>
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
      <div className="grid gap-2 bg-white p-2 md:grid-cols-2 xl:grid-cols-4">
        {categoryGroups.map((group, groupIndex) => (
          <div key={group.title} className="border bg-white p-3">
            <h3 className="mb-3 text-sm font-bold text-sky-dark">{group.title}</h3>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item, itemIndex) => {
                const cat = categories[(groupIndex * 4 + itemIndex) % Math.max(categories.length, 1)];
                return (
                  <Link key={item} href={`/shop?search=${encodeURIComponent(item)}`} className="group overflow-hidden rounded-md bg-neutral-50 p-2 text-center">
                    <div className="relative mx-auto mb-2 h-20 w-full overflow-hidden rounded bg-white">
                      {cat?.image_url || cat?.image ? (
                        <Image src={cat.image_url || cat.image || ""} alt={item} fill className="object-cover transition group-hover:scale-105" sizes="140px" />
                      ) : (
                        <div className="grid h-full place-items-center bg-sky-light text-primary">
                          <Sparkles className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-neutral-600">{item}</span>
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
