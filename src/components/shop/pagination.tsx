import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
}) {
  const makeHref = (page: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => v && k !== "page" && params.set(k, v));
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  };

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const s = Math.max(2, currentPage - 1);
    const e = Math.min(totalPages - 1, currentPage + 1);
    for (let i = s; i <= e; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5">
      {currentPage > 1 && (
        <Link
          href={makeHref(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:border-primary hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots-${i}`} className="px-2 text-neutral-400">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            className={cn(
              "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium",
              p === currentPage
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-white hover:border-primary hover:text-primary"
            )}
          >
            {p}
          </Link>
        )
      )}
      {currentPage < totalPages && (
        <Link
          href={makeHref(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border bg-white hover:border-primary hover:text-primary"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}
