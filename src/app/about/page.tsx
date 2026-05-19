export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div className="container mt-4 max-w-3xl md:mt-8">
      <h1 className="text-2xl font-bold md:text-3xl">About SobarbazarBD</h1>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
        SobarbazarBD is Bangladesh's trusted online marketplace, connecting thousands of sellers with millions of shoppers across all 64 districts.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700 md:text-base">
        Our mission is simple: bring authentic products, fair prices, and reliable delivery to every Bangladeshi household. From small businesses to established brands, we empower local commerce to thrive online.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat n="10K+" label="Products" />
        <Stat n="500+" label="Sellers" />
        <Stat n="50K+" label="Happy customers" />
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl border bg-white p-5 text-center">
      <div className="text-3xl font-bold text-primary">{n}</div>
      <div className="mt-1 text-sm text-neutral-600">{label}</div>
    </div>
  );
}
