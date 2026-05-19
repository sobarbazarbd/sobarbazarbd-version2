import type { MetadataRoute } from "next";
import { SITE_URL, apiFetch, endpoints } from "@/lib/api";

const STATIC = ["", "/shop", "/exclusive", "/stores", "/blog", "/about", "/contact", "/become-seller"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries = STATIC.map((p) => ({
    url: `${SITE_URL}${p || "/"}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  // Optionally fetch product slugs (best-effort)
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const res = await apiFetch<{ data?: { results?: Array<{ slug: string }> } }>(
      `${endpoints.products}?page=1&page_size=100`,
      { revalidate: 3600 }
    );
    const items = res?.data?.results || [];
    productEntries = items.map((p) => ({
      url: `${SITE_URL}/product/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
  } catch {
    /* ignore */
  }

  return [...staticEntries, ...productEntries];
}
