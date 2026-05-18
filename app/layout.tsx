import type { Metadata, Viewport } from "next";
import { Bebas_Neue, EB_Garamond, Inter } from "next/font/google";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { OrganizationJsonLd } from "@/components/json-ld";
import { brand } from "@/lib/brand";
import { getAllAlbums } from "@/lib/portfolio";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  display: "swap",
});

const garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bookandcapture.com"),
  title: {
    default: `${brand.name} — ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description:
    "Editorial, lifestyle, beauty, and motion work by Book & Capture — photography and videography for people and brands.",
  keywords: [
    "photography",
    "videography",
    "editorial",
    "beauty",
    "lifestyle",
    "portraits",
    "commercial",
    "Book & Capture",
  ],
  authors: [{ name: brand.name }],
  creator: brand.name,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description:
      "Editorial, lifestyle, beauty, and motion work by Book & Capture.",
    type: "website",
    siteName: brand.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} — ${brand.tagline}`,
    description:
      "Editorial, lifestyle, beauty, and motion work by Book & Capture.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f5f0eb",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createSupabaseServerClient();
  const [albums, userResult] = await Promise.all([
    getAllAlbums(),
    supabase.auth.getUser(),
  ]);
  const user = userResult.data.user;
  const isAuthenticated = !!user;

  let userRole: "admin" | "client" | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role === "admin" ? "admin" : "client";
  }

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bebas.variable} ${garamond.variable} ${inter.variable}`}
    >
      <body className="min-h-screen flex flex-col">
        <OrganizationJsonLd />
        <Link href="#main" className="skip-link">
          Skip to content
        </Link>
        <SiteHeader
          albums={albums}
          isAuthenticated={isAuthenticated}
          userRole={userRole}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <SpeedInsights />
      </body>
    </html>
  );
}
