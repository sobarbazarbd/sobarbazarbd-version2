import Image from "next/image";
import Link from "next/link";
import { apiFetch, endpoints, type ApiResponse, type Store } from "@/lib/api";

export const revalidate = 300;
export const metadata = { title: "All Stores" };

export default async function StoresPage() {
  const res = await apiFetch<ApiResponse<Store[] | { results: Store[] }>>(endpoints.storesPublic);
  const stores: Store[] = Array.isArray(res?.data)
    ? (res?.data as Store[])
    : (res?.data as { results?: Store[] } | undefined)?.results || [];

  return (
    <div className="container mt-4 md:mt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">All Stores</h1>
        <p className="mt-1 text-sm text-neutral-500">Discover verified vendors on SobarbazarBD</p>
      </header>

      {stores.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center text-neutral-500">No stores available.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stores.map((s) => (
            <Link
              key={s.id}
              href={`/stores/${s.slug || s.id}`}
              className="group rounded-xl border bg-white p-5 text-center transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border bg-neutral-50">
                {s.logo ? (
                  <Image src={s.logo} alt={s.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-sm font-bold text-neutral-400">
                    {s.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
              </div>
              <h3 className="mt-3 font-semibold group-hover:text-primary">{s.name}</h3>
              {s.city && <p className="mt-0.5 text-xs text-neutral-500">{s.city}</p>}
              {s.code && <p className="mt-0.5 text-[10px] text-neutral-400">Code: {s.code}</p>}
              {s.rating ? (
                <p className="mt-1 text-xs text-amber-600">★ {s.rating.toFixed(1)}</p>
              ) : null}
              <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
                View Products
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
