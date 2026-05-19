import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import { apiFetch, endpoints, type ApiResponse } from "@/lib/api";

export const revalidate = 600;

type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  thumbnail?: string;
  published_at?: string;
  author?: { name?: string; username?: string };
  tags?: string[];
};

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const res = await apiFetch<ApiResponse<BlogPost>>(endpoints.blogDetail(slug), { revalidate: 600 });
  const post = res?.data;
  if (!post) return { title: "Blog Post Not Found" };
  return {
    title: `${post.title} — SobarbazarBD Blog`,
    description: post.excerpt || post.title,
    openGraph: post.thumbnail ? { images: [{ url: post.thumbnail }] } : undefined,
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const res = await apiFetch<ApiResponse<BlogPost>>(endpoints.blogDetail(slug), { revalidate: 600 });
  const post = res?.data as BlogPost | undefined;
  if (!post) notFound();

  return (
    <div className="container mt-4 max-w-3xl md:mt-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-primary">Blog</Link>
        <span>/</span>
        <span className="truncate text-neutral-700">{post.title}</span>
      </nav>

      <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {post.thumbnail && (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-100">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 800px"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold leading-snug text-neutral-900 md:text-3xl">{post.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-500">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.published_at).toLocaleDateString("en-BD", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </span>
            )}
            {post.author?.name && (
              <span>By <strong className="text-neutral-700">{post.author.name}</strong></span>
            )}
          </div>

          {post.excerpt && (
            <p className="mt-4 text-base font-medium leading-relaxed text-neutral-600">{post.excerpt}</p>
          )}

          {post.content && (
            <div
              className="prose prose-neutral mt-6 max-w-none text-sm leading-7"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t pt-6">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      <div className="mt-6">
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <ChevronLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    </div>
  );
}
