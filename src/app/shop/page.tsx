import Link from "next/link";
import { apiFetch, endpoints, type ApiResponse, type Category, type FilterOptions, type Paginated, type Product } from "@/lib/api";
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
  brand?: string;
  min_price?: string;
  max_price?: string;
  min_rating?: string;
  sort?: string;
  store?: string;
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
  // Backend filters products via django-filter field paths, not the pretty
  // names we keep in the URL — map them here (same params the legacy frontend sends).
  if (sp.category) params.set("supplier_product__subcategories__category", sp.category);
  if (sp.subcategory) params.set("supplier_product__subcategories", sp.subcategory);
  if (sp.brand) params.set("supplier_product__brand_or_company", sp.brand);
  if (sp.store) params.set("supplier_product__store", sp.store);
  if (sp.min_price) params.set("min_price", sp.min_price);
  if (sp.max_price) params.set("max_price", sp.max_price);
  if (sp.min_rating) params.set("min_rating", sp.min_rating);
  if (sp.sort) params.set("ordering", sortToOrdering(sp.sort));

  const [productsRes, filterOptionsRes, categoriesRes] = await Promise.all([
    apiFetch<ApiResponse<Paginated<Product>>>(`${endpoints.products}?${params.toString()}`, {
      revalidate: 60,
    }),
    apiFetch<FilterOptions>(endpoints.filterOptions, { revalidate: 3600 }),
    apiFetch<ApiResponse<Category[]>>(`${endpoints.categories}?pagination=0`, { revalidate: 3600 }),
  ]);

  const products = (productsRes?.data?.results || []).map(productToCard);
  const total = productsRes?.data?.count || 0;
  const totalPages = Math.ceil(total / 20);

  // filter_options currently 500s on the live backend (Category has no slug there);
  // fall back to the categories endpoint so the sidebar keeps working either way.
  const filterOptions: FilterOptions | null =
    filterOptionsRes ??
    (categoriesRes?.data
      ? {
          categories: categoriesRes.data.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug || "",
            subcategories: (c.subcategories || []).map((s) => ({
              id: s.id,
              name: s.name,
              slug: s.slug || "",
            })),
          })),
          brands: [],
          price_range: { min: 0, max: 500000 },
        }
      : null);

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
          <ShopFilters
            options={filterOptions}
            active={{
              category: sp.category,
              subcategory: sp.subcategory,
              brand: sp.brand,
              minPrice: sp.min_price,
              maxPrice: sp.max_price,
              minRating: sp.min_rating,
            }}
          />
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

// Backend `ordering_fields` allows created_at / updated_at / supplier_product__name.
// Price values match what the legacy frontend sends (ignored until backend allows them).
function sortToOrdering(sort: string): string {
  switch (sort) {
    case "price-low": return "variants__price";
    case "price-high": return "-variants__price";
    case "newest": return "-created_at";
    case "name": return "supplier_product__name";
    default: return "";
  }
}
