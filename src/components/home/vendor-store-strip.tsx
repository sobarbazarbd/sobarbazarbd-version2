"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, BadgeCheck, Store as StoreIcon } from "lucide-react";

type VendorStore = {
  id: number | string;
  name: string;
  slug?: string;
  href?: string;
  logo?: string;
  banner?: string;
  description?: string;
  showcase_images?: Array<{ image: string }>;
};

export function VendorStoreStrip({ stores }: { stores: VendorStore[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  if (!stores.length) return null;

  return (
    <section className="container mt-3">
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-sky-dark">Top Vendor Stores</h2>
            <p className="text-xs text-neutral-500">Trusted sellers, fast shopping, easy order</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => scroll("left")}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border bg-white text-neutral-600 transition-colors hover:bg-sky-light hover:text-primary"
              aria-label="Scroll left"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full border bg-white text-neutral-600 transition-colors hover:bg-sky-light hover:text-primary"
              aria-label="Scroll right"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <Link
              href="/stores"
              className="ml-1 hidden items-center gap-1 rounded-full border border-primary px-3 py-1 text-xs font-bold text-primary transition-colors hover:bg-sky-light sm:flex"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex items-start gap-3 overflow-x-auto pb-2 scrollbar-none"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {stores.slice(0, 12).map((store, index) => {
            const image = store.banner || store.logo || "/placeholder.png";
            const featured = index === 0 || index === 1;
            const href = store.href || (store.slug ? `/stores/${store.slug}` : `/stores`);
            return (
              <Link
                key={`${store.id}-${index}`}
                href={href}
                className={[
                  "group relative shrink-0 overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
                  featured ? "h-[185px] w-[240px] sm:w-[300px]" : "h-[155px] w-[190px] sm:w-[240px]",
                ].join(" ")}
              >
                <div className="relative h-[62%] bg-sky-light">
                  <Image
                    src={image}
                    alt={store.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes={featured ? "300px" : "240px"}
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                  <span className="absolute right-2 top-2 rounded-full bg-white/90 px-1.5 py-0.5 text-[9px] font-black text-primary">
                    Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 px-2.5 py-2">
                  <span className="-mt-6 grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-white shadow">
                    {store.logo ? (
                      <Image
                        src={store.logo}
                        alt={store.name}
                        width={44}
                        height={44}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <StoreIcon className="h-5 w-5 text-primary" />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-0.5 truncate text-xs font-black text-neutral-900">
                      {store.name}
                      <BadgeCheck className="h-3 w-3 shrink-0 text-primary" />
                    </span>
                    <span className="line-clamp-1 text-[10px] text-neutral-500">
                      {store.description || "Shop this vendor"}
                    </span>
                  </span>
                </div>
              </Link>
            );
          })}

          <Link
            href="/stores"
            className="flex h-[155px] w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-sky-light text-center sm:w-[150px]"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow">
              <StoreIcon className="h-5 w-5 text-primary" />
            </span>
            <span className="text-xs font-bold text-primary">View All Stores</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
