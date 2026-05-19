import Link from "next/link";
import { ArrowRight, BadgePercent, Gift } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="bg-white">
      <div className="container px-0 sm:px-4 lg:px-6">
        <div className="relative min-h-[260px] overflow-hidden bg-[#72edf2] sm:min-h-[350px] lg:min-h-[500px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,.55),transparent_28%),linear-gradient(180deg,rgba(255,255,255,.2),rgba(0,143,154,.1))]" />
          <div className="absolute left-8 top-0 hidden h-24 w-px bg-[#087a91]/35 md:block" />
          <div className="absolute left-4 top-14 hidden h-24 w-14 rounded-b-full border-4 border-[#087a91]/70 md:block" />
          <div className="absolute right-14 top-0 hidden h-24 w-px bg-[#087a91]/35 md:block" />
          <div className="absolute right-8 top-14 hidden h-24 w-14 rounded-b-full border-4 border-[#087a91]/70 md:block" />

          <div className="relative z-10 grid min-h-[260px] grid-cols-1 items-center gap-4 px-5 py-8 sm:min-h-[350px] sm:px-10 lg:min-h-[500px] lg:grid-cols-[1fr_390px] lg:px-20">
            <div className="max-w-3xl text-center lg:text-left">
              <span className="inline-flex items-center gap-2 bg-[#073d4e] px-3 py-1 text-xs font-bold uppercase text-[#f7e063]">
                <Gift className="h-3.5 w-3.5" /> Eid Special Offer
              </span>
              <h1 className="mt-4 text-4xl font-black leading-tight text-[#064c64] sm:text-6xl lg:text-7xl">
                সবারবাজারে সবার খুশি
              </h1>
              <p className="mt-3 inline-block bg-[#063d4f] px-5 py-3 text-xl font-extrabold text-[#ffec61] sm:text-3xl">
                দেশি পণ্য, দ্রুত ডেলিভারি
              </p>
              <p className="mx-auto mt-4 max-w-lg text-base font-semibold text-[#096371] lg:mx-0 lg:text-lg">
                Bags, shoes, jewelry, watches and daily essentials in one marketplace.
              </p>
              <Link
                href="/shop"
                className="mt-4 inline-flex items-center gap-2 bg-white px-5 py-2 text-sm font-bold text-[#087a91] shadow-sm hover:bg-[#f1ffff]"
              >
                Shop Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <Link
              href="/shop?sort=popular"
              className="mx-auto hidden w-full max-w-[340px] border-8 border-[#0a7190] bg-[#077895] p-7 text-center text-white shadow-lg lg:block"
            >
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/15">
                <BadgePercent className="h-8 w-8" />
              </span>
              <span className="mt-3 block text-5xl font-black text-[#fff263]">7%</span>
              <span className="block text-xl font-black">Discount</span>
              <span className="mt-3 block text-5xl font-black text-[#fff263]">5%</span>
              <span className="block text-xl font-black">Cashback</span>
              <span className="mt-3 block text-xs text-white/80">Selected products only</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
