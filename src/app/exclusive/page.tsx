import Link from "next/link";
import { apiFetch, endpoints, type ApiResponse, type ExclusiveProduct, type Paginated, type Category } from "@/lib/api";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { Pagination } from "@/components/shop/pagination";

export const revalidate = 120;

const toCard = (p: ExclusiveProduct): ProductCardData => ({
  id: p.id,
  href: `/exclusive/${p.id}`,
  name: p.name,
  image: p.image_url,
  regularPrice: Number(p.regular_price || 0),
  sellingPrice: Number(p.display_price ?? p.selling_price ?? 0),
  rating: p.rating || undefined,
  storeName: "RAKAMARI",
  isExclusive: true,
  isVariable: Boolean(p.is_variable),
});

type Search = {
  page?: string;
  search?: string;
  category?: string;
};

export default async function ExclusivePage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Number(sp.page || 1);
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", "20");
  if (sp.search) params.set("search", sp.search);
  if (sp.category) params.set("category", sp.category);

  const [productsRes, catsRes] = await Promise.all([
    apiFetch<ApiResponse<Paginated<ExclusiveProduct>>>(`${endpoints.exclusive}?${params.toString()}`, {
      revalidate: 120,
    }),
    apiFetch<ApiResponse<Category[]>>(endpoints.exclusiveCategories, { revalidate: 3600 }),
  ]);

  const products = (productsRes?.data?.results || []).map(toCard);
  const total = productsRes?.data?.count || 0;
  const totalPages = Math.ceil(total / 20);
  const categories = catsRes?.data || [];

  return (
    <div className="container mt-4 md:mt-8">
      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Exclusive</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-white sm:p-10">
        <span className="inline-flex rounded-full bg-white/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide backdrop-blur">
          Rakamari Store
        </span>
        <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          Exclusive Picks at Unbeatable Prices
        </h1>
        <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base">
          Curated dropshipping deals — quality assured, fast delivery anywhere in Bangladesh.
        </p>
      </div>

      {/* Categories chips */}
      {categories.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/exclusive"
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              !sp.category ? "border-amber-500 bg-amber-500 text-white" : "bg-white hover:border-amber-400"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/exclusive?category=${c.droploo_id}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                String(sp.category) === String(c.droploo_id)
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "bg-white hover:border-amber-400"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        {products.length === 0 ? (
          <div className="rounded-xl border bg-white py-16 text-center">
            <h3 className="text-lg font-semibold">No exclusive products found</h3>
          </div>
        ) : (
          <>
            <p className="mb-3 text-sm text-neutral-600">
              <strong>{total}</strong> exclusive products
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                basePath="/exclusive"
                searchParams={sp}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
