"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const list = images.length ? images : ["/placeholder.png"];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border bg-neutral-50">
        <Image
          key={list[active]}
          src={list[active]}
          alt={name}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          className="object-contain p-4 animate-fade-in"
          priority
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-none">
          {list.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition ${
                i === active ? "border-primary" : "border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-contain p-1" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
