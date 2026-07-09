"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { API_BASE, endpoints, type Review } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  const r = Math.round(Number(rating) || 0);
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < r ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"}
        />
      ))}
    </span>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

/** Ported from frontend/src/components/ProductDetailsTwo.jsx:96-186 (the live, API-wired review implementation). */
export function ProductReviews({
  productId,
  productRating,
  productReviewCount,
}: {
  productId: number | string;
  productRating?: number;
  productReviewCount?: number;
}) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`${API_BASE}${endpoints.productReviews(productId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        const list = Array.isArray(data) ? data : data?.data ?? [];
        setReviews(Array.isArray(list) ? list : []);
      })
      .catch((err) => console.error("Fetch reviews failed:", err))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [productId]);

  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / total : Number(productRating) || 0;
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }
    if (!form.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE}${endpoints.productReviews(productId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `JWT ${token}` },
        body: JSON.stringify({ rating: form.rating, comment: form.comment, orderitem_id: 0 }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setForm({ rating: 5, comment: "" });
        toast.success("Review submitted successfully!");
      } else {
        const errorData: { detail?: string; non_field_errors?: string[] } = await res
          .json()
          .catch(() => ({}));
        toast.error(
          errorData?.detail ||
            errorData?.non_field_errors?.[0] ||
            "You can only review products you have purchased and received"
        );
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-6 rounded-xl border bg-white p-5 md:p-8">
      <h2 className="mb-5 text-lg font-bold">Reviews{total ? ` (${total})` : ""}</h2>

      <div className="flex flex-wrap items-center gap-6 border-b pb-5">
        <div className="text-center">
          <p className="text-4xl font-extrabold">{total > 0 ? average.toFixed(1) : Number(productRating || 0).toFixed(1)}</p>
          <Stars rating={total > 0 ? average : Number(productRating) || 0} size={16} />
          <p className="mt-1 text-xs text-neutral-500">
            {total > 0 ? `${total} reviews` : productReviewCount ? `${productReviewCount} reviews` : "No reviews yet"}
          </p>
        </div>
        <div className="flex-1 min-w-[180px] space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                </div>
                <span>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="divide-y">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
          </div>
        ) : reviews.length === 0 ? (
          <p className="py-4 text-sm text-neutral-500">No reviews yet — be the first to review this product!</p>
        ) : (
          reviews.slice(0, 6).map((review) => {
            const name = review.customer?.name || "Customer";
            return (
              <div key={review.id} className="flex gap-3 py-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-primary text-sm font-bold text-white">
                  {review.customer?.profile_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={review.customer.profile_image} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    name.trim().charAt(0).toUpperCase()
                  )}
                </span>
                <div>
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    {name}
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">Verified Order</span>
                  </p>
                  <Stars rating={review.rating} size={12} />
                  <p className="mt-1 text-sm text-neutral-700">{review.comment}</p>
                  <p className="mt-1 text-xs text-neutral-400">{formatDate(review.created_at)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 border-t pt-5">
        <h3 className="mb-3 text-sm font-bold">Write a Review</h3>
        {!user ? (
          <p className="text-sm text-neutral-600">
            Please{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              login
            </Link>{" "}
            to write a review.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: star }))}
                    aria-label={`${star} star`}
                  >
                    <Star
                      className={cn(
                        "h-5 w-5",
                        star <= form.rating ? "fill-amber-400 text-amber-400" : "fill-neutral-200 text-neutral-200"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Share your experience with this product..."
              value={form.comment}
              onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-neutral-500">You can only review products you have purchased and received.</p>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
