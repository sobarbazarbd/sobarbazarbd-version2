"use client";

import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowLeft, ArrowRight, Heart, ShoppingBag, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, discountPercent, formatBDT } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { trackAddToCart } from "@/components/meta-pixel";
import { pushAddToCart } from "@/components/gtm";
import { toast } from "sonner";
import { isLoggedIn, isWishlisted, subscribeWishlist, toggleWishlist } from "@/lib/wishlist";
import type { ProductCardData } from "@/components/product/product-card";

const VISIBLE_COUNT = 24;

// Mobile: fixed-width columns that scroll horizontally with snap (swipe carousel).
// sm+: switches to a wrapping grid (3 / 4 / 6 columns) — same markup, no JS.
const GRID_CLASSES =
  "flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scroll-smooth scrollbar-none";

function SectionHeader({ onPrev, onNext }: { onPrev?: () => void; onNext?: () => void } = {}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4 sm:mb-7">
      <div>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Fresh From Sellers
        </span>
        <h2 id="uploaded-products-heading" className="mt-2 text-2xl font-black tracking-tight text-neutral-950 sm:text-[28px]">
          Uploaded Products
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-neutral-500">
          Latest products from your sellers and store uploads
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {onPrev && onNext ? (
          <>
            <button
              type="button"
              onClick={onPrev}
              aria-label="Previous uploaded products"
              className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Next uploaded products"
              className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 shadow-sm transition hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </>
        ) : null}
        <Link
          href="/shop"
          className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-xs font-bold text-neutral-800 shadow-sm transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white hover:shadow-md"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

/** Loading placeholder matching the live grid's shape — for use with a future Suspense boundary. */
export function UploadedProductsSkeleton() {
  return (
    <section className="container mt-8" aria-hidden="true">
      <SectionHeader />
      <div className={GRID_CLASSES}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-[46vw] max-w-[260px] shrink-0 snap-start animate-pulse rounded-lg border border-neutral-100 bg-white shadow-sm sm:w-[250px] lg:w-[260px]"
          >
            <div className="h-[46vw] max-h-[260px] min-h-[180px] w-full rounded-t-lg bg-neutral-200 sm:h-[250px] lg:h-[260px]" />
            <div className="p-2.5">
              <div className="h-4 w-2/3 rounded bg-neutral-200" />
              <div className="mt-2 h-3 w-4/5 rounded bg-neutral-200" />
              <div className="mt-3 h-6 w-3/4 rounded bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const UploadedProductCard = memo(function UploadedProductCard({ p }: { p: ProductCardData }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [saved, setSaved] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);
  const off = discountPercent(p.regularPrice, p.sellingPrice);
  const href = p.href || `/product/${p.slug || p.id}`;
  const ratingValue = Number(p.rating || 5);
  const soldCount = p.reviews || Math.max(28, Number(p.id) % 900);
  const repurchaseRate = Math.max(0, off || (Number(p.id) % 24));

  useEffect(() => {
    let active = true;
    const sync = () => {
      isWishlisted(p.id).then((v) => {
        if (active) setSaved(v);
      });
    };
    sync();
    const unsub = subscribeWishlist(sync);
    return () => {
      active = false;
      unsub();
    };
  }, [p.id]);

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (p.isVariable || !p.variantId) {
      window.location.href = href;
      return;
    }

    setAdding(true);
    const result = await addToCart(p.variantId, 1);
    setAdding(false);

    if (result.success) {
      const unitPrice = p.sellingPrice || p.regularPrice;
      trackAddToCart({ contentId: p.id, contentName: p.name, value: unitPrice, quantity: 1 });
      pushAddToCart({ id: p.id, name: p.name, price: unitPrice, quantity: 1, category: p.storeName || "" });
      toast.success("Added to cart");
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn()) {
      toast.error("Please login to save items to your wishlist");
      window.location.href = "/login";
      return;
    }
    setWishBusy(true);
    const result = await toggleWishlist(p);
    setWishBusy(false);
    if (result.error) {
      toast.error("Failed to update wishlist");
      return;
    }
    setSaved(result.added);
    toast.success(result.added ? "Saved to wishlist" : "Removed from wishlist");
  };

  return (
    <li className="w-[46vw] max-w-[260px] shrink-0 snap-start sm:w-[250px] lg:w-[260px]">
      <Link
        href={href}
        aria-label={`${p.name}${off > 0 ? `, ${off}% off` : ""}, ${formatBDT(p.sellingPrice || p.regularPrice)}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/35 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="relative h-[46vw] max-h-[260px] min-h-[180px] w-full overflow-hidden bg-neutral-50 sm:h-[250px] lg:h-[260px]">
          <Image
            src={p.image || "/placeholder.png"}
            alt={p.name}
            fill
            loading="lazy"
            sizes="(max-width: 640px) 46vw, 260px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-1.5 py-1 text-[10px] font-black uppercase text-white shadow-sm">
            New
          </span>

          <button
            type="button"
            onClick={handleWishlist}
            disabled={wishBusy}
            aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
            className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-neutral-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-60"
          >
            <Heart className={cn("h-3.5 w-3.5", saved && "fill-rose-500 stroke-rose-500")} aria-hidden="true" />
          </button>

          {/* Hover quick-add */}
          <div className="absolute inset-x-2 bottom-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Button
              type="button"
              onClick={handleAdd}
              disabled={adding}
              size="sm"
              className="h-8 w-full gap-1.5 rounded-full bg-neutral-950/90 text-[11px] font-bold text-white shadow-lg hover:bg-primary"
            >
              <ShoppingCart className="h-3.5 w-3.5" aria-hidden="true" />
              {adding ? "Adding…" : "Quick Add"}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-baseline gap-1.5">
              <span className="text-[18px] font-black leading-none text-pink-600">
                {formatBDT(p.sellingPrice || p.regularPrice)}
              </span>
              {off > 0 && (
                <span className="truncate text-[12px] font-semibold text-neutral-400 line-through">{formatBDT(p.regularPrice)}</span>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-neutral-600">
              <span className="inline-flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("h-3 w-3", i < Math.round(ratingValue) ? "fill-amber-400 stroke-amber-400" : "stroke-neutral-300")}
                    aria-hidden="true"
                  />
                ))}
              </span>
              {ratingValue.toFixed(1).replace(".0", "")}
            </span>
          </div>

          <h3 className="mt-2 line-clamp-1 text-[12px] font-semibold leading-5 text-neutral-600 transition-colors group-hover:text-primary">
            {p.name}
          </h3>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
            <span className="rounded bg-sky-50 px-2 py-1 text-[10.5px] font-bold uppercase text-sky-700">
              {soldCount >= 1000 ? `${(soldCount / 1000).toFixed(1)}k` : soldCount} sold
            </span>
            <span className="rounded bg-sky-50 px-2 py-1 text-[10.5px] font-bold text-sky-700">
              {repurchaseRate}% Repurchase
            </span>
          </div>

          <span className="sr-only">
            View Product
            <span>
              {formatBDT(p.sellingPrice || p.regularPrice)}
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
});

export function UploadedProductsSection({
  products,
  error = false,
}: {
  products: ProductCardData[];
  error?: boolean;
}) {
  const sliderRef = useRef<HTMLUListElement>(null);
  const items = products.filter((item) => !item.isExclusive).slice(0, VISIBLE_COUNT);
  const scrollProducts = (direction: "prev" | "next") => {
    const slider = sliderRef.current;
    if (!slider) return;
    const distance = Math.max(slider.clientWidth * 0.85, 260);
    slider.scrollBy({ left: direction === "next" ? distance : -distance, behavior: "smooth" });
  };

  return (
    <section className="container mt-8" aria-labelledby="uploaded-products-heading">
      <SectionHeader onPrev={() => scrollProducts("prev")} onNext={() => scrollProducts("next")} />

      {error ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-14 text-center">
          <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden="true" />
          <p className="text-sm font-semibold text-neutral-700">Couldn&apos;t load uploaded products</p>
          <p className="text-xs text-neutral-500">Please refresh the page or try again shortly.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-14 text-center">
          <ShoppingBag className="h-6 w-6 text-neutral-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-neutral-700">No uploaded products yet</p>
          <Link href="/shop" className="text-xs font-bold text-primary hover:underline">
            Browse all products instead
          </Link>
        </div>
      ) : (
        <ul ref={sliderRef} role="list" className={GRID_CLASSES}>
          {items.map((p) => (
            <UploadedProductCard key={p.id} p={p} />
          ))}
        </ul>
      )}
    </section>
  );
}
