import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-neutral-50 py-10">
      <div className="container">
        <Link href="/" className="mb-8 inline-block text-center text-2xl font-bold">
          <span className="text-primary">Sobar</span>
          <span className="text-neutral-900">bazar</span>
          <span className="text-primary">BD</span>
        </Link>
        <div className="mx-auto max-w-md">{children}</div>
      </div>
    </div>
  );
}
