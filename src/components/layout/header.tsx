"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, Heart, User, Menu, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

const SIDEBAR_LINKS = [
  { label: "Bags", href: "/shop?category=bags" },
  { label: "Jewelry", href: "/shop?category=jewelry" },
  { label: "Shoes", href: "/shop?category=shoes" },
  { label: "Beauty", href: "/shop?category=beauty" },
  { label: "Mens Wear", href: "/shop?category=mens-wear" },
  { label: "Women Wear", href: "/shop?category=women-wear" },
  { label: "Eyewear", href: "/shop?category=eyewear" },
  { label: "Baby Items", href: "/shop?category=baby-items" },
  { label: "Watches", href: "/shop?category=watches" },
  { label: "Gadgets", href: "/shop?category=gadgets" },
];

export function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-[62px] items-center gap-4 bg-[#087f94] px-4 text-white sm:px-6">
      {/* Mobile menu / sidebar drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-16 items-center justify-center border-b">
            <Logo />
          </div>
          <nav className="flex flex-col">
            {SIDEBAR_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
            className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light hover:text-sky-primary"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/exclusive"
              className="border-b px-4 py-3 text-sm font-medium text-amber-600 hover:bg-amber-50"
            >
              Exclusive · Hot
            </Link>
            <Link href="/blog" className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light">
              Blog
            </Link>
            <Link href="/become-seller" className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light">
              Become a Seller
            </Link>
            <div className="p-4">
              {user ? (
                <>
                  <Link
                    href="/account"
                    className="block rounded-md bg-sky px-3 py-2.5 text-center text-sm font-semibold text-white"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={logout}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-md bg-sky px-3 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign in / Register
                </Link>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* Logo */}
      <Link href="/" className="flex shrink-0 items-center">
        <Logo />
      </Link>

      {/* Centered search */}
      <form action="/shop" className="flex flex-1 items-center justify-center px-1 sm:px-4">
        <div className="relative w-full max-w-2xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            name="search"
            placeholder="Search Product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-0 bg-white pl-10 pr-12 text-sm text-neutral-800 shadow-sm focus-visible:ring-2 focus-visible:ring-white"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full bg-white text-[#087f94] hover:bg-sky-light"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
        <button
          type="button"
          className="ml-2 hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#087f94] hover:bg-sky-light sm:flex"
          aria-label="Search by image"
        >
          <Camera className="h-5 w-5" />
        </button>
      </form>

      {/* Right icons */}
      <div className="ml-auto flex items-center gap-3">
        <IconLink href="/cart" aria-label="Cart" badge={cartCount}>
          <ShoppingBag className="h-5 w-5" />
        </IconLink>
        <IconLink href="/wishlist" aria-label="Wishlist">
          <Heart className="h-5 w-5" />
        </IconLink>
        <IconLink href={user ? "/account" : "/login"} aria-label="Account">
          <User className="h-5 w-5" />
        </IconLink>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="flex items-center gap-2 text-2xl font-black leading-none text-white">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#087f94]">
        <ShoppingBag className="h-5 w-5" />
      </span>
      <span>Sobar</span>
      <span>bazarBD</span>
    </span>
  );
}

function IconLink({
  href, children, badge, "aria-label": ariaLabel,
}: { href: string; children: React.ReactNode; badge?: number; "aria-label"?: string }) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className="relative grid h-10 w-10 place-items-center rounded-full bg-white text-[#087f94] transition-colors hover:bg-sky-light"
    >
      {children}
      {badge !== undefined && badge > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
