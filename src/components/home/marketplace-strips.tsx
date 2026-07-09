import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ChevronRight, LayoutGrid } from "lucide-react";
import type { Category } from "@/lib/api";

const quickTabs = ["Latest", "Offer", "Shipment", "Collaboration", "Event", "Guideline", "Achievement", "Review", "Social Work"];

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

/** Display-ready shape for a single category card, derived from the live `Category` API type. */
export interface CategoryCardData {
  id: number;
  title: string;
  href: string;
  image?: string;
  isExclusive: boolean;
  /** Real product count from the API when available (customer + supplier listings). */
  productCount: number;
  subCount: number;
}

function toCategoryCard(cat: Category): CategoryCardData {
  return {
    id: cat.id,
    title: cat.name,
    href: cat.href || `/shop?category=${cat.id}`,
    image: cat.image_url || cat.image,
    isExclusive: Boolean(cat.isExclusive),
    productCount: (cat.customer_products_count || 0) + (cat.supplier_products_count || 0),
    subCount: cat.subcategories?.length || 0,
  };
}

// Mobile: fixed-width columns that scroll horizontally with snap.
// sm+: switches to a wrapping grid (3 / 5 / 6 columns) — same markup, no JS.
const CATEGORY_GRID_CLASSES =
  "grid grid-flow-col auto-cols-[45%] gap-3 overflow-x-auto pb-1 snap-x snap-mandatory scrollbar-none sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:pb-0 lg:grid-cols-5 xl:grid-cols-6";

function CategoryShowcaseHeader() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 px-4 py-5 sm:px-6">
      <div>
        <span className="text-[11px] font-black uppercase tracking-wider text-primary">Departments</span>
        <h2 id="shop-by-categories" className="mt-1 text-xl font-black text-neutral-950 sm:text-2xl">
          Shop by Categories
        </h2>
        <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
          Browse marketplace and RAKAMARI collections with clear product groups
        </p>
        <p className="mt-0.5 text-xs font-medium text-neutral-400">আপনার প্রয়োজনীয় পণ্য খুঁজুন সহজেই</p>
      </div>
      <Link
        href="/shop"
        className="hidden shrink-0 items-center gap-1.5 rounded-full border border-primary/25 bg-white px-4 py-2 text-xs font-bold text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white sm:inline-flex"
      >
        View All Categories
        <ChevronRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/** Loading placeholder matching the live grid's shape — for use with a future Suspense boundary. */
export function CategoryShowcaseSkeleton() {
  return (
    <section className="container mt-4" aria-hidden="true">
      <div className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
        <CategoryShowcaseHeader />
        <div className="p-4 sm:p-6">
          <div className={CATEGORY_GRID_CLASSES}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="snap-start animate-pulse rounded-2xl border border-neutral-100 bg-neutral-50 p-3"
              >
                <div className="aspect-square w-full rounded-xl bg-neutral-200" />
                <div className="mt-3 h-3.5 w-3/4 rounded bg-neutral-200" />
                <div className="mt-2 h-2.5 w-1/2 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CategoryShowcase({ categories, error = false }: { categories: Category[]; error?: boolean }) {
  const cards = categories.filter((cat) => cat?.name).slice(0, 12).map(toCategoryCard);

  return (
    <section className="container mt-4" aria-labelledby="shop-by-categories">
      <div className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-sm">
        <CategoryShowcaseHeader />

        <div className="bg-gradient-to-b from-neutral-50/80 to-white p-4 sm:p-6">
          {error ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center">
              <AlertTriangle className="h-6 w-6 text-amber-500" aria-hidden="true" />
              <p className="text-sm font-semibold text-neutral-700">Couldn&apos;t load categories right now</p>
              <p className="text-xs text-neutral-500">Please refresh the page or try again shortly.</p>
            </div>
          ) : cards.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center">
              <LayoutGrid className="h-6 w-6 text-neutral-400" aria-hidden="true" />
              <p className="text-sm font-semibold text-neutral-700">No categories available yet</p>
              <Link href="/shop" className="text-xs font-bold text-primary hover:underline">
                Browse all products instead
              </Link>
            </div>
          ) : (
            <ul role="list" className={CATEGORY_GRID_CLASSES}>
              {cards.map((card) => (
                <li key={card.id} className="snap-start">
                  <Link
                    href={card.href}
                    aria-label={`${card.title}${card.productCount ? `, ${card.productCount} products` : ""}`}
                    className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_18px_40px_-14px_rgba(6,95,88,0.28)] sm:p-3.5"
                  >
                    <span className="pointer-events-none absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-primary/30 via-transparent to-amber-400/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-neutral-100">
                      {card.image ? (
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <LayoutGrid className="h-7 w-7 text-primary/40" aria-hidden="true" />
                        </div>
                      )}
                      {card.isExclusive && (
                        <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-400 px-2 py-0.5 text-[9px] font-black uppercase text-amber-950 shadow-sm">
                          RAKAMARI
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-1 items-end justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="line-clamp-1 text-sm font-bold text-neutral-900 transition-colors group-hover:text-primary sm:text-[15px]">
                          {card.title}
                        </h3>
                        <p className="mt-0.5 truncate text-[11px] font-medium text-neutral-500">
                          {card.productCount > 0
                            ? `${card.productCount} products`
                            : card.subCount > 1
                              ? `${card.subCount} collections`
                              : "View collection"}
                        </p>
                      </div>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-primary group-hover:text-white">
                        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!error && cards.length > 0 && (
            <Link
              href="/shop"
              className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-primary/25 bg-white py-2.5 text-xs font-bold text-primary shadow-sm transition hover:border-primary hover:bg-primary hover:text-white sm:hidden"
            >
              View All Categories
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
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
