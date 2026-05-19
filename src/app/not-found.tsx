import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-primary md:text-8xl">404</p>
      <h1 className="mt-3 text-xl font-bold md:text-2xl">Page not found</h1>
      <p className="mt-1 text-sm text-neutral-500">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-5">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
