export type Album = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  cover?: string;
};

export type MediaItem = {
  id: string;
  albumId: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  name: string;
  width: number;
  height: number;
  alt?: string;
};

export const albums: Album[] = [
  {
    id: "editorial",
    slug: "editorial",
    name: "Editorial",
    description: "Magazine-ready narratives and signature looks.",
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "Beauty",
    description: "Skin, light, and intimate detail.",
  },
  {
    id: "lifestyle",
    slug: "lifestyle",
    name: "Lifestyle",
    description: "Real moments, cinematic light.",
  },
  {
    id: "portraits",
    slug: "portraits",
    name: "Portraits",
    description: "People, presence, and personality.",
  },
  {
    id: "commissioned",
    slug: "commissioned",
    name: "Commissioned",
    description: "Campaign and brand work.",
  },
  {
    id: "motion",
    slug: "motion",
    name: "Motion",
    description: "Short-form video and cinematic clips.",
  },
];

const U = (id: string, w = 1600, q = 90) =>
  `https://images.unsplash.com/${id}?w=${w}&q=${q}&auto=format&fit=max`;

export const media: MediaItem[] = [
  {
    id: "m1",
    albumId: "editorial",
    type: "image",
    src: U("photo-1504703395950-b89145a5425b"),
    name: "Monarch Portrait",
    alt: "Woman with soft wind-swept hair against a sunlit backdrop.",
    width: 1600,
    height: 1066,
  },
  {
    id: "m2",
    albumId: "beauty",
    type: "image",
    src: U("photo-1519741497674-611481863552"),
    name: "Wedding Flowers",
    alt: "A bouquet of pastel flowers held against a neutral dress.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m3",
    albumId: "lifestyle",
    type: "image",
    src: U("photo-1529626455594-4ff0802cfb7e"),
    name: "Desert Sunset",
    alt: "Warm desert light over a lone figure walking across sand.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m4",
    albumId: "editorial",
    type: "image",
    src: U("photo-1531746020798-e6953c6e8e04"),
    name: "Close-up Beauty",
    alt: "Close portrait capturing freckles and soft natural light.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m5",
    albumId: "commissioned",
    type: "image",
    src: U("photo-1524504388940-b1c1722653e1"),
    name: "Fashion Portrait",
    alt: "Editorial fashion portrait with sculptural fabric.",
    width: 1600,
    height: 2400,
  },
  {
    id: "m6",
    albumId: "portraits",
    type: "image",
    src: U("photo-1488161628813-04466f872be2"),
    name: "Couple Session",
    alt: "Intimate portrait of a couple laughing in golden light.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m7",
    albumId: "beauty",
    type: "image",
    src: U("photo-1494790108377-be9c29b29330"),
    name: "Warm Portrait",
    alt: "Warm-toned portrait against a soft neutral wall.",
    width: 1600,
    height: 1600,
  },
  {
    id: "m8",
    albumId: "lifestyle",
    type: "image",
    src: U("photo-1503342217505-b0a15ec3261c"),
    name: "Urban Editorial",
    alt: "Figure against architectural light in an urban setting.",
    width: 1600,
    height: 2400,
  },
  {
    id: "m9",
    albumId: "portraits",
    type: "image",
    src: U("photo-1517841905240-472988babdf9"),
    name: "Studio Shot",
    alt: "Clean studio portrait with sculpted shadows.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m10",
    albumId: "beauty",
    type: "image",
    src: U("photo-1602233158242-3ba0ac4d2167"),
    name: "Glow Skin",
    alt: "Macro beauty shot highlighting skin texture and glow.",
    width: 1600,
    height: 2000,
  },
  {
    id: "m11",
    albumId: "editorial",
    type: "image",
    src: U("photo-1492633423870-43d1cd2775eb"),
    name: "Golden Hour",
    alt: "Subject silhouetted against golden-hour sunlight.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m12",
    albumId: "commissioned",
    type: "image",
    src: U("photo-1519345182560-3f2917c472ef"),
    name: "Brand Campaign",
    alt: "Commercial campaign still with model and product.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m13",
    albumId: "beauty",
    type: "image",
    src: U("photo-1534528741775-53994a69daeb"),
    name: "Beauty Close-Up",
    alt: "Close beauty portrait with natural bronze tones.",
    width: 1600,
    height: 2400,
  },
  {
    id: "m14",
    albumId: "lifestyle",
    type: "image",
    src: U("photo-1483985988355-763728e1935b"),
    name: "Street Style",
    alt: "Street-style editorial caught mid-stride.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m15",
    albumId: "commissioned",
    type: "image",
    src: U("photo-1469334031218-e382a71b716b"),
    name: "Outdoor Session",
    alt: "Outdoor editorial session amid soft greenery.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m16",
    albumId: "portraits",
    type: "image",
    src: U("photo-1509631179647-0177331693ae"),
    name: "Fashion Studio",
    alt: "Fashion studio portrait with painterly light.",
    width: 1600,
    height: 2400,
  },
  {
    id: "m17",
    albumId: "editorial",
    type: "image",
    src: U("photo-1512361436605-a484bdb34b5f"),
    name: "Film Editorial",
    alt: "Film-toned editorial with cinematic grain.",
    width: 1600,
    height: 1067,
  },
  {
    id: "m18",
    albumId: "lifestyle",
    type: "image",
    src: U("photo-1488426862026-3ee34a7d66df"),
    name: "Joy Portrait",
    alt: "Candid joyful moment caught in soft afternoon light.",
    width: 1600,
    height: 1067,
  },
];

export function getMediaForAlbum(slug: string | null): MediaItem[] {
  if (!slug || slug === "all") return media;
  const album = albums.find((a) => a.slug === slug);
  if (!album) return [];
  return media.filter((m) => m.albumId === album.id);
}

export function getAlbumBySlug(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}

export const heroImage: MediaItem = {
  id: "hero",
  albumId: "editorial",
  type: "image",
  src: U("photo-1504703395950-b89145a5425b", 2400, 95),
  name: "Book & Capture hero",
  alt: "Featured editorial portrait in warm natural light.",
  width: 2400,
  height: 1600,
};

export const brand = {
  name: "Book & Capture",
  tagline: "Photography & Videography",
  email: "hello@bookandcapture.com",
  instagramUrl: "https://instagram.com/",
  vimeoUrl: "https://vimeo.com/",
  tiktokUrl: "https://tiktok.com/",
} as const;
