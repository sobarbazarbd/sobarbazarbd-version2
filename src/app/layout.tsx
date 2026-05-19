import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LeftSidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-nav";
import { FloatingWidgets } from "@/components/layout/floating-widgets";
import { Providers } from "./providers";
import { MetaPixel } from "@/components/meta-pixel";
import { GTM, GTMNoScript } from "@/components/gtm";
import { SITE_URL } from "@/lib/api";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_NAME = "SobarbazarBD";
const SITE_DESCRIPTION =
  "Bangladesh's trusted online marketplace. Shop fashion, electronics, exclusive products with fast delivery across Bangladesh.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Online Shopping Marketplace in Bangladesh`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    locale: "en_BD",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?search={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-muted font-sans antialiased">
        <GTMNoScript />
        <Providers>
          <Suspense fallback={null}>
            <MetaPixel />
            <GTM />
          </Suspense>
          <div className="flex">
            <LeftSidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <Header />
              <main className="pb-20 lg:pb-0">{children}</main>
              <Footer />
            </div>
          </div>
          <FloatingWidgets />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
