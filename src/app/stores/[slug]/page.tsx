import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Star, Store as StoreIcon } from "lucide-react";
import { apiFetch, endpoints, type ApiResponse, type Paginated, type Product, type Store } from "@/lib/api";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";

export const revalidate = 300;

type PageProps = { params: Promise<{ slug: string }> };

const productToCard = (p: Product): ProductCardData => {
  const regular = Number(p.default_variant?.price || 0);
  const selling = Number(p.default_variant?.final_price || regular);
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
    isVariable: (p.variants?.length ?? 0) > 1,
    variantId: p.default_variant?.id ?? null,
  };
};

async function getStore(slug: string) {
  const detail = await apiFetch<ApiResponse<Store>>(endpoints.storeDetailPublic(slug), { revalidate: 300 });
  if (detail?.data) return detail.data;

  const list = await apiFetch<ApiResponse<Store[] | { results: Store[] }>>(endpoints.storesPublic, { revalidate: 300 });
  const stores = Array.isArray(list?.data)
    ? list.data
    : (list?.data as { results?: Store[] } | undefined)?.results || [];
  return stores.find((store) => String(store.slug || store.id || store.code) === slug) || null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) return { title: "Store Not Found" };
  return {
    title: `${store.name} - SobarbazarBD`,
    description: store.description || `Shop products from ${store.name} on SobarbazarBD`,
    openGraph: store.banner || store.logo ? { images: [{ url: store.banner || store.logo || "" }] } : undefined,
  };
}

export default async function StoreDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const store = await getStore(slug);
  if (!store) notFound();

  const productParams = new URLSearchParams({
    page: "1",
    page_size: "20",
    // django-filter param path — a bare `store` param is silently ignored by the backend
    supplier_product__store: String(store.id),
  });
  const productsRes = await apiFetch<ApiResponse<Paginated<Product>>>(`${endpoints.products}?${productParams}`, {
    revalidate: 60,
  });
  const products = (productsRes?.data?.results || []).map(productToCard);

  return (
    <div className="container mt-4 md:mt-8">
      <nav className="mb-3 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/stores" className="hover:text-primary">Stores</Link>
        <span className="mx-1.5">/</span>
        <span className="text-neutral-700">{store.name}</span>
      </nav>

      <section className="overflow-hidden rounded-xl border bg-white">
        <div className="relative h-40 bg-neutral-100 md:h-56">
          {store.banner ? (
            <Image src={store.banner} alt={store.name} fill className="object-cover" priority />
          ) : (
            <div className="grid h-full place-items-center bg-gradient-to-br from-emerald-50 to-sky-50">
              <StoreIcon className="h-12 w-12 text-primary/40" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-4">
            <div className="-mt-12 grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-xl border-4 border-white bg-neutral-50 shadow-sm">
              {store.logo ? (
                <Image src={store.logo} alt={store.name} width={96} height={96} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold text-neutral-400">{store.name.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{store.name}</h1>
              {store.description && <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-600">{store.description}</p>}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-neutral-500">
                {store.city && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {store.city}</span>}
                {store.phone_number && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {store.phone_number}</span>}
                {store.rating ? <span className="inline-flex items-center gap-1 text-amber-600"><Star className="h-3.5 w-3.5 fill-amber-500" /> {store.rating.toFixed(1)}</span> : null}
              </div>
            </div>
          </div>
          <Link href={`/shop?store=${store.id}`} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90">
            View all products
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Products from {store.name}</h2>
          <Link href={`/shop?store=${store.id}`} className="text-sm font-semibold text-primary hover:underline">
            See all
          </Link>
        </div>
        {products.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} p={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border bg-white py-14 text-center text-sm text-neutral-500">
            No products available from this store yet.
          </div>
        )}
      </section>
    </div>
  );
}
