"use client";

import { Download, MessageCircle, HeadphonesIcon } from "lucide-react";

export function FloatingWidgets() {
  return (
    <div className="pointer-events-none fixed bottom-3 left-2 z-30 hidden lg:flex lg:flex-col lg:gap-2">
      <Widget label="Get App" icon={<Download className="h-5 w-5" />} href="#app" />
      <Widget label="Chat" icon={<MessageCircle className="h-5 w-5" />} href="#chat" />
      <Widget label="Support" icon={<HeadphonesIcon className="h-5 w-5" />} href="/contact" />
    </div>
  );
}

function Widget({ label, icon, href }: { label: string; icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="pointer-events-auto flex w-[60px] flex-col items-center gap-1 rounded-xl border bg-white px-2 py-2 text-[10px] font-semibold text-neutral-600 shadow-sm transition hover:border-sky hover:text-sky-primary"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-light text-sky-primary">
        {icon}
      </span>
      {label}
    </a>
  );
}
