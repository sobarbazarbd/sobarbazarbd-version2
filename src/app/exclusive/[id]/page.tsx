import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { apiFetch, endpoints, type ApiResponse, type ExclusiveProduct } from "@/lib/api";
import { ProductGallery } from "@/components/product/product-gallery";
import { ExclusiveBuyBox } from "@/components/product/exclusive-buy-box";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const res = await apiFetch<ApiResponse<ExclusiveProduct>>(endpoints.exclusiveDetail(id));
  return { title: res?.data?.name || "Exclusive Product" };
}

export default async function ExclusiveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await apiFetch<ApiResponse<ExclusiveProduct>>(endpoints.exclusiveDetail(id), { revalidate: 300 });
  const product = res?.data;
  if (!product) notFound();

  const images = [product.image_url, ...(product.product_images?.map((v) => v.imageUrl) || [])]
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <div className="container mt-4 md:mt-6">
      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/exclusive" className="hover:text-primary">Exclusive</Link>
        <span className="mx-1.5">/</span>
        <span className="line-clamp-1 text-neutral-700">{product.name}</span>
      </nav>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />
        <ExclusiveBuyBox product={product} />
      </div>

      {product.description && (
        <section className="mt-10 rounded-xl border bg-white p-5 md:p-8">
          <h2 className="mb-4 text-lg font-bold">Description</h2>
          <div
            className="prose prose-sm max-w-none text-neutral-700"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </section>
      )}
    </div>
  );
}
