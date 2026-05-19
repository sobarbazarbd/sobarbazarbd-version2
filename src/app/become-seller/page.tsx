import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Store, TrendingUp, Wallet, ShieldCheck } from "lucide-react";

export const metadata = { title: "Become a Seller" };

export default function BecomeSellerPage() {
  return (
    <div className="container mt-4 md:mt-8">
      {/* Hero */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-6 text-white sm:p-10">
        <h1 className="text-2xl font-bold leading-tight md:text-4xl">Grow your business with SobarbazarBD</h1>
        <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
          Join 500+ sellers reaching customers across Bangladesh. 0% commission for first 3 months.
        </p>
      </div>

      {/* Perks */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Perk icon={<Store />} title="Free store setup" body="Launch in under 24 hours" />
        <Perk icon={<TrendingUp />} title="Reach millions" body="Pan-Bangladesh delivery network" />
        <Perk icon={<Wallet />} title="Fast payouts" body="Weekly disbursements" />
        <Perk icon={<ShieldCheck />} title="Seller protection" body="COD insurance available" />
      </div>

      {/* Apply form */}
      <Card className="mt-8">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-lg font-bold">Apply to sell</h2>
          <form className="mt-4 grid gap-3 sm:grid-cols-2">
            <Input placeholder="Business name *" />
            <Input placeholder="Contact name *" />
            <Input placeholder="Phone *" />
            <Input placeholder="Email *" type="email" />
            <Input placeholder="Business address" className="sm:col-span-2" />
            <textarea
              placeholder="Tell us about your products and brand"
              rows={4}
              className="sm:col-span-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
            />
            <Button type="submit" size="lg" className="sm:col-span-2">
              Submit application
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Perk({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">{icon}</span>
        <h3 className="mt-3 text-sm font-bold">{title}</h3>
        <p className="mt-0.5 text-xs text-neutral-500">{body}</p>
      </CardContent>
    </Card>
  );
}
