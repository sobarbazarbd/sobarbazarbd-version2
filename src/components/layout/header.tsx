"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Heart, Loader2, LogOut, Menu, Search, ShoppingBag, Store, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { API_BASE, endpoints, type Category, type Product } from "@/lib/api";
import { formatBDT } from "@/lib/utils";

export function Header() {
  const { t, i18n } = useTranslation();
  const { cartCount, openSidebar } = useCart();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState("");

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      localStorage.setItem("sobarbazar_language", lang);
    } catch {
      /* ignore */
    }
  };
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch(`${API_BASE}${endpoints.categories}?pagination=0`).then((res) => (res.ok ? res.json() : null)),
      fetch(`${API_BASE}${endpoints.exclusiveCategories}`).then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([json, exclusiveJson]) => {
        if (cancelled) return;
        const list = json?.data ?? json?.results ?? json ?? [];
        const exclusiveList = exclusiveJson?.data ?? exclusiveJson?.results ?? exclusiveJson ?? [];
        const regular = Array.isArray(list) ? list : [];
        const exclusive = Array.isArray(exclusiveList)
          ? exclusiveList.map((cat: Category) => ({
              ...cat,
              href: `/exclusive?category=${cat.droploo_id || cat.id}`,
              isExclusive: true,
              subcategories: (cat.subcategories || []).map((sub: Category) => ({
                ...sub,
                href: `/exclusive?category=${sub.droploo_id || sub.id}`,
                isExclusive: true,
              })),
            }))
          : [];
        setCategories([
          {
            id: -999,
            name: "RAKAMARI",
            slug: "rakamari",
            href: "/exclusive",
            isExclusive: true,
            subcategories: exclusive,
          },
          ...regular,
        ]);
      })
      .catch(() => setCategories([]));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearching(true);
      try {
        const params = new URLSearchParams({ search: query, page_size: "6" });
        const res = await fetch(`${API_BASE}${endpoints.products}?${params}`, { signal: controller.signal });
        if (!res.ok) return;
        const json = await res.json();
        const list = json?.data?.results ?? json?.results ?? [];
        setSuggestions(Array.isArray(list) ? list : []);
      } catch (err: any) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!searchWrapRef.current?.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[70px] items-center gap-2 border-b border-white/10 bg-[#075f58] px-3 text-white shadow-[0_10px_30px_rgba(6,95,88,.16)] sm:gap-4 sm:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 rounded-full text-white hover:bg-white/10 lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-16 items-center justify-center border-b bg-[#075f58]">
              <FullLogo />
            </div>
            <nav className="flex max-h-[calc(100vh-64px)] flex-col overflow-y-auto">
              <Link href="/shop" className="border-b px-4 py-3 text-sm font-bold text-primary hover:bg-emerald-50">
                {t("header.allCategories")}
              </Link>
              {categories.map((cat) => (
                <div key={cat.id} className="border-b">
                  <Link
                    href={cat.href || `/shop?category=${cat.id}`}
                    className="block px-4 py-3 text-sm font-semibold text-neutral-750 hover:bg-emerald-50 hover:text-primary"
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories?.length ? (
                    <div className="grid grid-cols-2 gap-1 px-4 pb-3">
                      {cat.subcategories.slice(0, 6).map((sub) => (
                        <Link key={sub.id} href={sub.href || `/shop?subcategory=${sub.id}`} className="truncate rounded bg-neutral-50 px-2 py-1.5 text-xs text-neutral-500 hover:text-primary">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
              <Link href="/exclusive" className="border-b px-4 py-3 text-sm font-medium text-[#FF9F29] hover:bg-orange-50">
                Exclusive Hot
              </Link>
              <Link href="/blog" className="border-b px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-sky-light">
                {t("nav.blog")}
              </Link>
              <Link href="/become-seller" className="border-b px-4 py-3 text-sm font-bold text-[#FF9F29] hover:bg-orange-50">
                {t("header.becomeSeller")}
              </Link>
              <div className="flex items-center gap-2 border-b px-4 py-3">
                <button
                  onClick={() => changeLanguage("en")}
                  className={`rounded px-3 py-1 text-xs font-bold ${!i18n.language?.startsWith("bn") ? "bg-primary text-white" : "text-neutral-500"}`}
                >
                  {t("language.english")}
                </button>
                <button
                  onClick={() => changeLanguage("bn")}
                  className={`rounded px-3 py-1 text-xs font-bold ${i18n.language?.startsWith("bn") ? "bg-primary text-white" : "text-neutral-500"}`}
                >
                  {t("language.bengali")}
                </button>
              </div>
              <div className="p-4">
                {user ? (
                  <>
                    <Link href="/account" className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white">
                      {t("header.dashboard")}
                    </Link>
                    <button onClick={logout} className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-sm font-medium">
                      <LogOut className="h-4 w-4" /> {t("header.logout")}
                    </button>
                  </>
                ) : (
                  <Link href="/login" className="block rounded-md bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white">
                    {t("header.loginRegister")}
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
          <div ref={searchWrapRef} className="relative w-full max-w-3xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              name="search"
              placeholder={t("header.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              className="h-10 rounded-full border-0 bg-white pl-10 pr-11 text-sm text-neutral-800 shadow-sm focus-visible:ring-2 focus-visible:ring-[#ffbf66] sm:h-11"
            />
            {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-neutral-400" />}
            {searchOpen && (suggestions.length > 0 || (search.trim().length > 1 && !searching)) && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border bg-white text-neutral-900 shadow-xl">
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((product) => {
                      const price = Number(product.default_variant?.final_price || product.default_variant?.price || 0);
                      return (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug || product.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0 hover:bg-neutral-50"
                        >
                          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-neutral-100">
                            <Image
                              src={product.images?.[0]?.image || "/placeholder.png"}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="44px"
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-1 text-sm font-medium">{product.name}</span>
                            {price > 0 && <span className="text-xs font-semibold text-primary">{formatBDT(price)}</span>}
                          </span>
                        </Link>
                      );
                    })}
                    <Link
                      href={`/shop?search=${encodeURIComponent(search.trim())}`}
                      onClick={() => setSearchOpen(false)}
                      className="block bg-neutral-50 px-3 py-2 text-center text-xs font-semibold text-primary hover:bg-neutral-100"
                    >
                      View all results
                    </Link>
                  </>
                ) : (
                  <div className="px-3 py-3 text-sm text-neutral-500">No matching products found</div>
                )}
              </div>
            )}
          </div>
        </form>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/become-seller"
            className="hidden h-11 items-center gap-2 rounded-full bg-[#FF9F29] px-4 text-xs font-black text-white shadow-sm transition hover:bg-[#f59e0b] xl:flex"
          >
            <Store className="h-4 w-4" />
            {t("header.becomeSeller")}
          </Link>

          <div className="hidden items-center gap-0.5 rounded-full bg-white/10 px-1 py-0.5 lg:flex">
            <button
              onClick={() => changeLanguage("en")}
              className={`rounded-full px-2 py-1 text-[11px] font-bold transition ${
                !i18n.language?.startsWith("bn") ? "bg-white text-[#075f58]" : "text-white/70"
              }`}
            >
              {t("language.english")}
            </button>
            <button
              onClick={() => changeLanguage("bn")}
              className={`rounded-full px-2 py-1 text-[11px] font-bold transition ${
                i18n.language?.startsWith("bn") ? "bg-white text-[#075f58]" : "text-white/70"
              }`}
            >
              {t("language.bengali")}
            </button>
          </div>

          <button
            onClick={openSidebar}
            aria-label="Open cart"
            className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-[#075f58] shadow-sm transition-colors hover:bg-emerald-50 sm:h-11 sm:w-11"
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
            aria-label={t("header.wishlist")}
            className="relative hidden h-10 w-10 place-items-center rounded-full bg-white text-[#075f58] shadow-sm transition-colors hover:bg-emerald-50 sm:grid sm:h-11 sm:w-11"
          >
            <Heart className="h-5 w-5" />
          </Link>

          <Link
            href={user ? "/account" : "/login"}
            aria-label="Account"
            className="relative hidden h-10 w-10 place-items-center rounded-full bg-white text-[#075f58] shadow-sm transition-colors hover:bg-emerald-50 sm:grid sm:h-11 sm:w-11"
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
        className="h-12 w-[170px] object-contain brightness-0 invert xl:w-[210px]"
        priority
      />
    </span>
  );
}
