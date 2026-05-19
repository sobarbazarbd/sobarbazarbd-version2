import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-6 bg-white">
      <div className="container py-8">
        <div className="rounded-lg border bg-white p-5 shadow-sm">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex">
                <Image src="/assets/images/logo/logo.png" alt="SobarbazarBD" width={250} height={80} className="h-16 w-[220px] object-contain" />
              </Link>
              <p className="mt-3 max-w-sm text-xs leading-6 text-neutral-600">
                We&apos;re Sobarbazar Bd, an innovative marketplace connecting buyers with trusted vendors across Bangladesh.
              </p>
              <div className="mt-3 flex flex-col gap-2 text-xs text-neutral-600">
                <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Uttara 12 No Sector, Dhaka</span>
                <a href="mailto:support24@Sobarbazarbd.com" className="flex items-center gap-2 hover:text-primary">
                  <Mail className="h-4 w-4 text-primary" /> support24@Sobarbazarbd.com
                </a>
                <a href="tel:+8801348080750" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4 text-primary" /> +880 1348-080750
                </a>
              </div>
            </div>

            <FooterCol
              title="Information"
              items={[
                { label: "About Us", href: "/about" },
                { label: "Become a Vendor", href: "/become-seller" },
                { label: "Our Vendors", href: "/stores" },
                { label: "Blog", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ]}
            />

            <FooterCol
              title="Customer Support"
              items={[
                { label: "Help Center", href: "/contact" },
                { label: "Return Policy", href: "/return-policy" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-conditions" },
                { label: "Online Shopping", href: "/shop" },
              ]}
            />

            <div>
              <h4 className="mb-3 text-sm font-bold text-neutral-900">Shop on The Go</h4>
              <p className="mb-3 text-xs text-neutral-600">Sobarbazar Bd App is available. Get it now</p>
              <div className="flex flex-wrap gap-2">
                <Image src="/assets/images/thumbs/store-img1.png" alt="Apple Store" width={118} height={36} className="h-9 w-auto object-contain" />
                <Image src="/assets/images/thumbs/store-img2.png" alt="Google Play" width={118} height={36} className="h-9 w-auto object-contain" />
              </div>
              <h4 className="mb-3 mt-5 text-sm font-bold text-neutral-900">Social Links</h4>
              <div className="flex gap-2">
                <a href="https://www.facebook.com" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-full bg-[#1877f2] text-white"><Facebook className="h-4 w-4" /></a>
                <a href="https://www.youtube.com" aria-label="YouTube" className="grid h-8 w-8 place-items-center rounded-full bg-[#ff0000] text-white"><Youtube className="h-4 w-4" /></a>
                <a href="https://www.instagram.com" aria-label="Instagram" className="grid h-8 w-8 place-items-center rounded-full bg-[#e4405f] text-white"><Instagram className="h-4 w-4" /></a>
                <a href="https://www.linkedin.com" aria-label="LinkedIn" className="grid h-8 w-8 place-items-center rounded-full bg-[#0a66c2] text-white"><Linkedin className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>

        <div className="py-4 text-center text-xs text-neutral-500">
          Copyright © {new Date().getFullYear()} <span className="font-semibold text-primary">SobarbazarBD</span>. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-bold text-neutral-900">{title}</h4>
      <ul className="flex flex-col gap-1.5 text-xs text-neutral-600">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="hover:text-primary">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
