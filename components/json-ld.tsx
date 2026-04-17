import { brand } from "@/lib/portfolio";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brand.name,
    url: "https://bookandcapture.com",
    email: brand.email,
    description:
      "Photography and videography for people and brands — editorial, beauty, lifestyle, and motion work.",
    sameAs: [brand.instagramUrl, brand.vimeoUrl, brand.tiktokUrl].filter(
      Boolean,
    ),
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
