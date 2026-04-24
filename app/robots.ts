import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/portal", "/portal/", "/login"],
      },
    ],
    sitemap: "https://bookandcapture.com/sitemap.xml",
  };
}
