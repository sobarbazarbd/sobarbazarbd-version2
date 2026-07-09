import { apiFetch, endpoints, type ApiResponse, type Category, type ExclusiveProduct, type Paginated, type Product } from "@/lib/api";
import { HeroBanner, type HeroSlide } from "@/components/home/hero-banner";
import { CategoryRail } from "@/components/home/category-rail";
import { ProductSection } from "@/components/home/product-section";
import { FeatureBar } from "@/components/home/feature-bar";
import { BrandStrip, CategoryShowcase, StoryTabs } from "@/components/home/marketplace-strips";
import { UploadedProductsSection } from "@/components/home/uploaded-products";
import { VendorStoreStrip } from "@/components/home/vendor-store-strip";
import type { ProductCardData } from "@/components/product/product-card";

export const revalidate = 60;

const FEATURED_UPLOAD_STORE_IDS = ["23", "63", "16"];

type HomeData = {
  banner_sections?: Array<{
    id?: number | string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    image_url?: string;
    banner?: string;
    type?: string;
  }>;
  recommended_products?: Product[];
  newly_arrived_products?: Product[];
  categories?: Category[];
  subcategories?: Category[];
  stores?: Array<{ id: number | string; name: string; slug?: string; logo?: string; banner?: string; description?: string; showcase_images?: Array<{ image: string }> }>;
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
    storeId: p.store?.id,
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
  const [homeRes, exclusiveRes, exclusiveCatsRes, ...featuredStoreProductsRes] = await Promise.all([
    // home-page-data response is ~3.2MB, over Next's 2MB data-cache limit — use
    // cache: "no-store" instead of revalidate so it bypasses the cache cleanly.
    apiFetch<ApiResponse<HomeData>>(endpoints.homePage, { cache: "no-store" }),
    apiFetch<ApiResponse<{ results: ExclusiveProduct[] }>>(`${endpoints.exclusive}?page=1&page_size=24`, {
      revalidate: 300,
    }),
    apiFetch<ApiResponse<Category[]>>(endpoints.exclusiveCategories, { revalidate: 3600 }),
    ...FEATURED_UPLOAD_STORE_IDS.map((storeId) =>
      apiFetch<ApiResponse<Paginated<Product>>>(
        `${endpoints.products}?supplier_product__store=${storeId}&page=1&page_size=8`,
        { revalidate: 300 }
      )
    ),
  ]);

  const data = homeRes?.data || {};
  const topCategories: Category[] = data.categories || [];
  const subcategories: Category[] =
    data.subcategories?.length
      ? data.subcategories
      : topCategories.flatMap((cat) => cat.subcategories || []);
  const exclusiveCategories: Category[] = (exclusiveCatsRes?.data || []).map((cat) => ({
    ...cat,
    href: `/exclusive?category=${cat.droploo_id || cat.id}`,
    isExclusive: true,
    subcategories: (cat.subcategories || []).map((sub) => ({
      ...sub,
      href: `/exclusive?category=${sub.droploo_id || sub.id}`,
      isExclusive: true,
      image_url: sub.image_url || cat.image_url || cat.image,
    })),
  }));
  const mergedTopCategories = [...topCategories, ...exclusiveCategories];
  const mergedRailCategories = [
    ...subcategories.map((cat) => ({ ...cat, href: `/shop?subcategory=${cat.id}` })),
    ...exclusiveCategories.map((cat) => ({ ...cat, href: `/exclusive?category=${cat.droploo_id || cat.id}` })),
  ];

  const recommended = (data.recommended_products || []).map(productToCard);
  const newArrivals = (data.newly_arrived_products || []).map(productToCard);
  const exclusive = (exclusiveRes?.data?.results || []).map(exclusiveToCard);
  const featuredStoreProducts = featuredStoreProductsRes
    .flatMap((res) => res?.data?.results || [])
    .map(productToCard);
  const fallbackUploadedProducts = [...newArrivals, ...recommended].filter((item) =>
    FEATURED_UPLOAD_STORE_IDS.includes(String(item.storeId))
  );
  const uploadedProductsSource = featuredStoreProducts.length ? featuredStoreProducts : fallbackUploadedProducts;
  const uploadedProducts = uploadedProductsSource.filter((item, index, arr) => {
    return arr.findIndex((candidate) => String(candidate.id) === String(item.id)) === index;
  });
  const stores = [
    {
      id: "rakamari",
      name: "RAKAMARI",
      slug: "rakamari",
      href: "/exclusive",
      logo: "/assets/images/thumbs/rokomari-logo.png",
      banner: exclusive[0]?.image || "/assets/images/thumbs/rokomari-logo.png",
      description: "Exclusive products and RAKAMARI categories",
    },
    ...(data.stores || []),
  ];
  const bannerSlides: HeroSlide[] = [
    ...(data.banner_sections || [])
      .map((section) => ({
        eyebrow: section.type || "Sobarbazar",
        title: section.title || "Shop verified seller collections",
        subtitle: section.subtitle || section.description || "Browse uploaded products from Sobarbazar sellers.",
        image: section.image_url || section.image || section.banner,
        href: "/shop",
      }))
      .filter((slide) => slide.image),
    ...mergedTopCategories
      .filter((cat) => cat.image_url || cat.image)
      .slice(0, 4)
      .map((cat) => ({
        eyebrow: "Category",
        title: `${cat.name} collection`,
        subtitle: cat.description || "Explore products from this category.",
        image: cat.image_url || cat.image,
        href: cat.href || `/shop?category=${cat.id}`,
      })),
    ...uploadedProducts
      .filter((product) => product.image)
      .slice(0, 2)
      .map((product) => ({
        eyebrow: "New Upload",
        title: product.name,
        subtitle: product.storeName ? `Available from ${product.storeName}` : "Freshly added product",
        image: product.image,
        href: product.href || "/shop",
      })),
  ];

  return (
    <>
      <HeroBanner slides={bannerSlides} />
      <VendorStoreStrip stores={stores} />
      <StoryTabs />
      <FeatureBar />
      <CategoryRail categories={mergedRailCategories} />
      <UploadedProductsSection products={uploadedProducts} error={!homeRes} />
      <CategoryShowcase categories={mergedTopCategories} error={!homeRes} />

      <ProductSection
        title="Newly Uploaded"
        subtitle="Latest products uploaded by sellers"
        viewAllHref="/shop?sort=newest"
        products={newArrivals.slice(0, 12)}
        accent="amber"
      />

      <ProductSection
        title="Recommended Products"
        subtitle="Popular picks from regular marketplace products"
        viewAllHref="/shop?sort=popular"
        products={recommended.slice(0, 12)}
      />

      <ProductSection
        title="More Store Products"
        subtitle="Explore more uploaded products"
        viewAllHref="/shop"
        products={uploadedProducts.slice(12, 24)}
        accent="red"
      />

      <ProductSection
        title="RAKAMARI Exclusive"
        subtitle="Exclusive products from the RAKAMARI store"
        viewAllHref="/exclusive"
        products={exclusive.slice(0, 12)}
        accent="amber"
      />

      <ProductSection
        title="You May Love"
        subtitle="More products picked for Sobarbazar shoppers"
        viewAllHref="/shop"
        products={uploadedProducts.slice(0, 24)}
      />

      <BrandStrip />
    </>
  );
}
