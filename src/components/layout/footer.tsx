import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, ShoppingBag, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-6 bg-white">
      <div className="container py-8">
        <div className="grid gap-8 border-t pt-8 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-primary">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">
                <ShoppingBag className="h-5 w-5" />
              </span>
              SobarbazarBD
            </Link>
            <p className="mt-3 max-w-sm text-xs leading-6 text-neutral-600">
              SobarbazarBD is a trusted marketplace for fashion, gadgets, accessories and daily products from reliable sellers.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-bold text-neutral-900">Contact</h4>
            <div className="flex flex-col gap-2 text-xs text-neutral-600">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Dhaka, Bangladesh</span>
              <span className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> support@sobarbazarbd.com</span>
              <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> 09678-123456</span>
              <Link href="/contact" className="font-semibold text-primary">Find us on map</Link>
            </div>
          </div>

          <FooterCol
            title="Information"
            items={[
              { label: "About", href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Privacy Policy", href: "/privacy-policy" },
              { label: "Returns & Refund", href: "/return-policy" },
              { label: "Terms & Conditions", href: "/terms-conditions" },
              { label: "Shipping Charge", href: "/shipping-charge" },
            ]}
          />

          <div>
            <h4 className="mb-3 text-sm font-bold text-neutral-900">Social Links</h4>
            <div className="flex gap-2">
              <a href="https://facebook.com/sobarbazarbd" aria-label="Facebook" className="grid h-8 w-8 place-items-center rounded-full bg-[#1877f2] text-white"><Facebook className="h-4 w-4" /></a>
              <a href="https://youtube.com/@sobarbazarbd" aria-label="YouTube" className="grid h-8 w-8 place-items-center rounded-full bg-[#ff0000] text-white"><Youtube className="h-4 w-4" /></a>
              <a href="https://instagram.com/sobarbazarbd" aria-label="Instagram" className="grid h-8 w-8 place-items-center rounded-full bg-[#e4405f] text-white"><Instagram className="h-4 w-4" /></a>
            </div>
            <div className="mt-5">
              <h5 className="mb-2 text-xs font-bold text-neutral-800">Get App</h5>
              <div className="flex gap-2">
                <span className="rounded bg-neutral-900 px-3 py-2 text-[10px] font-bold text-white">Google Play</span>
                <span className="rounded bg-neutral-900 px-3 py-2 text-[10px] font-bold text-white">App Store</span>
              </div>
            </div>
          </div>
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
