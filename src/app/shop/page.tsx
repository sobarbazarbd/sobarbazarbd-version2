import Link from "next/link";
import { apiFetch, endpoints, type ApiResponse, type Category, type Paginated, type Product } from "@/lib/api";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";
import { ShopFilters } from "@/components/shop/shop-filters";
import { ShopSortBar } from "@/components/shop/shop-sort-bar";
import { Pagination } from "@/components/shop/pagination";

export const revalidate = 60;

type Search = {
  page?: string;
  search?: string;
  category?: string;
  subcategory?: string;
  min_price?: string;
  max_price?: string;
  sort?: string;
};

const productToCard = (p: Product): ProductCardData => {
  const regular = Number(p.default_variant?.price || 0);
  const selling = Number(p.default_variant?.final_price || regular);
  const hasMultiple = (p.variants?.length ?? 0) > 1;
  return {
    id: p.id,
    slug: p.slug,
    href: `/product/${p.slug || p.id}`,
    name: p.name,
    image: p.images?.[0]?.image || "",
    regularPrice: regular,
    sellingPrice: selling,
    rating: p.rating || undefined,
    reviews: p.review_count || p.reviews || undefined,
    storeName: p.store?.name,
    isVariable: hasMultiple,
    variantId: p.default_variant?.id ?? null,
  };
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const page = Number(sp.page || 1);
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("page_size", "20");
  if (sp.search) params.set("search", sp.search);
  if (sp.category) params.set("category", sp.category);
  if (sp.subcategory) params.set("subcategories", sp.subcategory);
  if (sp.min_price) params.set("min_price", sp.min_price);
  if (sp.max_price) params.set("max_price", sp.max_price);
  if (sp.sort) params.set("ordering", sortToOrdering(sp.sort));

  const [productsRes, categoriesRes] = await Promise.all([
    apiFetch<ApiResponse<Paginated<Product>>>(`${endpoints.products}?${params.toString()}`, {
      revalidate: 60,
    }),
    apiFetch<ApiResponse<Category[]>>(`${endpoints.categories}?pagination=0`, { revalidate: 3600 }),
  ]);

  const products = (productsRes?.data?.results || []).map(productToCard);
  const total = productsRes?.data?.count || 0;
  const totalPages = Math.ceil(total / 20);
  const categories = categoriesRes?.data || [];

  return (
    <div className="container mt-4 md:mt-8">
      {/* Breadcrumb */}
      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">Shop</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside className="hidden lg:block">
          <ShopFilters categories={categories} active={{ category: sp.category, subcategory: sp.subcategory, minPrice: sp.min_price, maxPrice: sp.max_price }} />
        </aside>

        {/* Results */}
        <section>
          <ShopSortBar total={total} currentSort={sp.sort} />

          {products.length === 0 ? (
            <div className="rounded-xl border bg-white py-16 text-center">
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="mt-1 text-sm text-neutral-500">Try adjusting your filters or search</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} basePath="/shop" searchParams={sp} />
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function sortToOrdering(sort: string): string {
  switch (sort) {
    case "price-low": return "default_variant__price";
    case "price-high": return "-default_variant__price";
    case "newest": return "-created_at";
    case "popular": return "-popularity";
    case "name": return "name";
    default: return "";
  }
}
