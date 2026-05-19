import { redirect } from "next/navigation";

export default async function StoreRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/shop?store=${encodeURIComponent(slug)}`);
}
