"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, LogOut, Menu, Search, ShoppingBag, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { CartDrawer } from "@/components/layout/cart-drawer";

const SIDEBAR_LINKS = [
  { label: "Apparel", href: "/shop?category=11" },
  { label: "Electronics", href: "/shop?category=12" },
  { label: "Grocery", href: "/shop?category=10" },
  { label: "Home Appliances", href: "/shop?category=13" },
  { label: "Furniture", href: "/shop?category=14" },
  { label: "Bags", href: "/shop?subcategory=100" },
  { label: "Cameras", href: "/shop?subcategory=85" },
  { label: "Men's Clothing", href: "/shop?subcategory=75" },
  { label: "Women's Clothing", href: "/shop?subcategory=76" },
  { label: "Watches", href: "/shop?search=watch" },
];

export function Header() {
  const { cartCount, openSidebar } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[62px] items-center gap-2 bg-[#08766f] px-3 text-white sm:gap-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 text-white hover:bg-white/10 lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center justify-center border-b">
              <FullLogo />
            </div>
            <nav className="flex flex-col">
              {SIDEBAR_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/exclusive" className="border-b px-4 py-3 text-sm font-medium text-[#FF9F29] hover:bg-orange-50">
                Exclusive Hot
              </Link>
              <Link href="/blog" className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light">
                Blog
              </Link>
              <Link href="/become-seller" className="border-b px-4 py-3 text-sm font-bold text-[#FF9F29] hover:bg-orange-50">
                Become a Seller
              </Link>
              <div className="p-4">
                {user ? (
                  <>
                    <Link href="/account" className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white">
                      My Account
                    </Link>
                    <button onClick={logout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white">
                    Sign in / Register
                  </Link>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="flex shrink-0 items-center">
          <Image src="/assets/images/logo/sobarbazarbd-logo.png" alt="SobarbazarBD" width={42} height={42} className="h-10 w-10 object-contain sm:hidden" priority />
          <FullLogo className="hidden sm:flex" />
        </Link>

        <form action="/shop" className="flex flex-1 items-center justify-center">
          <div className="relative w-full max-w-2xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              name="search"
              placeholder="Search Product"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 rounded-xl border-0 bg-white pl-10 pr-4 text-sm text-neutral-800 shadow-sm focus-visible:ring-2 focus-visible:ring-white sm:h-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/become-seller"
            className="hidden h-10 items-center gap-2 rounded-full bg-[#FF9F29] px-4 text-xs font-black text-white shadow-sm transition hover:bg-[#f59e0b] xl:flex"
          >
            <Store className="h-4 w-4" />
            Become Seller
          </Link>

          <button
            onClick={openSidebar}
            aria-label="Open cart"
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#08766f] transition-colors hover:bg-sky-light sm:h-10 sm:w-10"
          >
            <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold text-white sm:h-5 sm:min-w-5 sm:text-[10px]">
                {cartCount}
              </span>
            )}
          </button>

          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative hidden h-9 w-9 place-items-center rounded-full bg-white text-[#08766f] transition-colors hover:bg-sky-light sm:grid sm:h-10 sm:w-10"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            aria-label="Account"
            className="relative hidden h-9 w-9 place-items-center rounded-full bg-white text-[#08766f] transition-colors hover:bg-sky-light sm:grid sm:h-10 sm:w-10"
          >
            <User className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <CartDrawer />
    </>
  );
}

function FullLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`items-center ${className}`}>
      <Image
        src="/assets/images/logo/logo.png"
        alt="SobarbazarBD"
        width={210}
        height={58}
        className="h-12 w-[170px] object-contain xl:w-[210px]"
        priority
      />
    </span>
  );
}
