import Image from "next/image";
import Link from "next/link";
import { apiFetch, endpoints, type ApiResponse } from "@/lib/api";

export const revalidate = 300;
export const metadata = { title: "Blog" };

type Post = { id: number; slug: string; title: string; excerpt?: string; thumbnail?: string; published_at?: string };

export default async function BlogPage() {
  const res = await apiFetch<ApiResponse<{ results: Post[] } | Post[]>>(endpoints.blogPosts);
  const data = res?.data as any;
  const posts: Post[] = Array.isArray(data) ? data : data?.results || [];

  return (
    <div className="container mt-4 md:mt-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Blog</h1>
        <p className="mt-1 text-sm text-neutral-500">Stories, tips, and updates from SobarbazarBD</p>
      </header>

      {posts.length === 0 ? (
        <div className="rounded-xl border bg-white py-16 text-center">
          <p className="text-neutral-500">No blog posts yet.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group overflow-hidden rounded-xl border bg-white transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {p.thumbnail && (
                <div className="relative aspect-[16/9] overflow-hidden bg-neutral-50">
                  <Image src={p.thumbnail} alt={p.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-4">
                <h3 className="line-clamp-2 font-semibold group-hover:text-primary">{p.title}</h3>
                {p.excerpt && <p className="mt-1.5 line-clamp-3 text-sm text-neutral-600">{p.excerpt}</p>}
                {p.published_at && (
                  <p className="mt-3 text-xs text-neutral-500">{new Date(p.published_at).toLocaleDateString()}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
