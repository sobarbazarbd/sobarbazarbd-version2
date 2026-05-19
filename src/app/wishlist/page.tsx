import { Heart } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container mt-8 flex min-h-[50vh] flex-col items-center justify-center text-center">
      <Heart className="h-16 w-16 text-neutral-300" />
      <h1 className="mt-3 text-xl font-bold">Your wishlist is empty</h1>
      <p className="mt-1 text-sm text-neutral-500">Save products you love for later</p>
      <Link href="/shop" className="mt-4 text-sm font-semibold text-primary hover:underline">
        Browse products
      </Link>
    </div>
  );
}
