import type { MetadataRoute } from "next";
import { albums } from "@/lib/portfolio";

const BASE = "https://bookandcapture.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const albumRoutes: MetadataRoute.Sitemap = albums.map((a) => ({
    url: `${BASE}/work/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...routes, ...albumRoutes];
}
