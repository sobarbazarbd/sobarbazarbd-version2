import { apiFetch, endpoints, type ApiResponse, type Category, type ExclusiveProduct, type Product } from "@/lib/api";
import { HeroBanner } from "@/components/home/hero-banner";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductSection } from "@/components/home/product-section";
import { FeatureBar } from "@/components/home/feature-bar";
import { BrandStrip, CategoryShowcase, DealStrip, StoryTabs, VendorStoreStrip } from "@/components/home/marketplace-strips";
import type { ProductCardData } from "@/components/product/product-card";

export const revalidate = 60;

type HomeData = {
  recommended_products?: Product[];
  newly_arrived_products?: Product[];
  categories?: Category[];
  subcategories?: Category[];
  stores?: Array<{ id: number | string; name: string; slug?: string; logo?: string; banner?: string; description?: string }>;
};

const num = (v: unknown, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const productToCard = (p: Product): ProductCardData => {
  const regular = num(p.default_variant?.price);
  const selling = num(p.default_variant?.final_price, regular);
  const hasMultiple = (p.variants?.length ?? 0) > 1;
  return {
    id: p.id,
    slug: p.slug,
    href: `/product/${p.slug || p.id}`,
    name: p.name,
    image: p.images?.[0]?.image || "",
    regularPrice: regular,
    sellingPrice: selling,
    rating: num(p.rating, 0) || undefined,
    reviews: p.review_count || p.reviews || undefined,
    storeName: p.store?.name,
    isVariable: hasMultiple,
    variantId: p.default_variant?.id ?? null,
  };
};

const exclusiveToCard = (p: ExclusiveProduct): ProductCardData => ({
  id: p.id,
  href: `/exclusive/${p.id}`,
  name: p.name,
  image: p.image_url,
  regularPrice: num(p.regular_price),
  sellingPrice: num(p.display_price ?? p.selling_price),
  rating: num(p.rating, 0) || undefined,
  storeName: "Sobarbazar Global",
  isExclusive: true,
  isVariable: Boolean(p.is_variable),
});

export default async function HomePage() {
  const [homeRes, exclusiveRes, exclusiveCatsRes] = await Promise.all([
    apiFetch<ApiResponse<HomeData>>(endpoints.homePage, { revalidate: 120 }),
    apiFetch<ApiResponse<{ results: ExclusiveProduct[] }>>(`${endpoints.exclusive}?page=1&page_size=24`, {
      revalidate: 300,
    }),
    apiFetch<ApiResponse<Category[]>>(endpoints.exclusiveCategories, { revalidate: 3600 }),
  ]);

  const data = homeRes?.data || {};
  const categories: Category[] = data.subcategories || data.categories || [];
  const exclusiveCategories = exclusiveCatsRes?.data || [];

  const mergedCategories: Category[] = [
    ...categories,
    ...exclusiveCategories.map((c) => ({ ...c, slug: c.slug || `exclusive-${c.droploo_id}` })),
  ];

  const recommended = (data.recommended_products || []).map(productToCard);
  const newArrivals = (data.newly_arrived_products || []).map(productToCard);
  const exclusive = (exclusiveRes?.data?.results || []).map(exclusiveToCard);
  const allProducts = [...exclusive, ...recommended, ...newArrivals];
  const stores = data.stores || [];

  return (
    <>
      <HeroBanner />
      <VendorStoreStrip stores={stores} products={allProducts} />
      <StoryTabs />
      <FeatureBar />
      <CategoryRail categories={mergedCategories} />
      <DealStrip products={allProducts} />
      <CategoryShowcase categories={mergedCategories} />

      <ProductSection
        title="Bags"
        subtitle="Popular bags and daily carry items"
        viewAllHref="/exclusive"
        products={exclusive.slice(0, 12)}
        accent="amber"
      />

      <ProductSection
        title="Shoe"
        subtitle="Trending footwear from trusted sellers"
        viewAllHref="/shop?sort=popular"
        products={recommended.slice(0, 12)}
      />

      <ProductSection
        title="Jewelry"
        subtitle="Fresh accessories and gift picks"
        viewAllHref="/shop?sort=newest"
        products={newArrivals.slice(0, 12)}
        accent="red"
      />

      <ProductSection
        title="You May Love"
        subtitle="More products picked for Sobarbazar shoppers"
        viewAllHref="/shop"
        products={allProducts.slice(0, 24)}
      />

      <BrandStrip />
    </>
  );
}
