import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch, endpoints, type ApiResponse, type Product } from "@/lib/api";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductBuyBox } from "@/components/product/product-buy-box";
import { ProductReviews } from "@/components/product/product-reviews";
import { ProductCompare } from "@/components/product/product-compare";
import type { Metadata } from "next";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const res = await apiFetch<ApiResponse<Product>>(endpoints.productDetail(slug), { revalidate: 300 });
  const p = res?.data;
  if (!p) return { title: "Product" };
  return {
    title: p.name,
    description: p.short_description || p.description?.slice(0, 160),
    openGraph: {
      title: p.name,
      description: p.short_description || "",
      images: p.images?.[0]?.image ? [p.images[0].image] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const res = await apiFetch<ApiResponse<Product>>(endpoints.productDetail(slug), { revalidate: 300 });
  const product = res?.data;

  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images?.map((i) => i.image) || [],
    description: product.short_description || product.description?.replace(/<[^>]+>/g, "").slice(0, 300),
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.default_variant?.final_price || product.default_variant?.price || 0,
      availability:
        (product.default_variant?.stock || 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container mt-4 md:mt-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="line-clamp-1 text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={product.images?.map((i) => i.image) || []} name={product.name} />
        <ProductBuyBox product={product} />
      </div>

      {/* Description */}
      {product.description && (
        <section className="mt-10 rounded-xl border bg-white p-5 md:p-8">
          <h2 className="mb-4 text-lg font-bold">Description</h2>
          <div
            className="prose prose-sm max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}

      <ProductReviews productId={product.id} productRating={product.rating} productReviewCount={product.review_count} />

      {(() => {
        // The live API sometimes returns related_products as a bare object
        // instead of an array when there's exactly one related product.
        const relatedProducts = Array.isArray(product.related_products)
          ? product.related_products
          : product.related_products
            ? [product.related_products]
            : [];
        return relatedProducts.length > 0 ? (
          <ProductCompare currentProduct={product} relatedProducts={relatedProducts} />
        ) : null;
      })()}
    </div>
  );
}
