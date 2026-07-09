"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  title: string;
  subtitle?: string;
  image?: string;
  href: string;
  eyebrow?: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    eyebrow: "Sobarbazar Mall",
    title: "Fresh products from verified sellers",
    subtitle: "Shop fashion, electronics, groceries and daily essentials with fast delivery.",
    image: "/assets/images/thumbs/banner-img1.png",
    href: "/shop",
  },
  {
    eyebrow: "New Arrivals",
    title: "Discover what sellers uploaded today",
    subtitle: "Browse the newest products with category images and real store collections.",
    image: "/assets/images/thumbs/banner-img2.png",
    href: "/shop?sort=newest",
  },
];

export function HeroBanner({ slides = [] }: { slides?: HeroSlide[] }) {
  const items = useMemo(() => (slides.length ? slides : fallbackSlides).slice(0, 6), [slides]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [items.length]);

  const slide = items[active] || fallbackSlides[0];
  const go = (direction: 1 | -1) => {
    setActive((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section className="bg-white pt-3">
      <div className="container">
        <div className="relative min-h-[280px] overflow-hidden rounded-lg border bg-[#eefaf7] shadow-sm sm:min-h-[360px] lg:min-h-[430px]">
          <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(5,80,72,.96)_0%,rgba(8,118,111,.88)_42%,rgba(236,253,245,.35)_100%)]" />
          {slide.image && (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.title}
              fill
              priority
              className="object-cover opacity-35 mix-blend-screen"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          )}

          <div className="relative z-10 grid min-h-[280px] items-center gap-6 px-5 py-7 sm:min-h-[360px] sm:px-10 lg:min-h-[430px] lg:grid-cols-[minmax(0,1fr)_420px] lg:px-14">
            <div className="max-w-2xl text-white">
              {slide.eyebrow && (
                <span className="inline-flex rounded-full border border-white/30 bg-white/12 px-3 py-1 text-xs font-bold uppercase tracking-wide">
                  {slide.eyebrow}
                </span>
              )}
              <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-white/85 sm:text-base">
                  {slide.subtitle}
                </p>
              )}
              <Link
                href={slide.href}
                className="mt-5 inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-bold text-[#075f58] shadow-sm transition hover:bg-emerald-50"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Link
              href={slide.href}
              className="relative mx-auto hidden aspect-[4/3] w-full max-w-[380px] overflow-hidden rounded-lg bg-white/90 p-3 shadow-2xl lg:block"
            >
              {slide.image ? (
                <Image src={slide.image} alt={slide.title} fill className="object-cover p-3" sizes="380px" />
              ) : (
                <div className="h-full w-full bg-emerald-50" />
              )}
            </Link>
          </div>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous slide"
                className="absolute left-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#075f58] shadow-sm transition hover:bg-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next slide"
                className="absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#075f58] shadow-sm transition hover:bg-white"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                {items.map((item, index) => (
                  <button
                    key={item.title + index}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${active === index ? "w-7 bg-white" : "w-2 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
