export type Album = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  cover?: string;
  expiresAt?: string;
};

export type MediaItem = {
  id: string;
  albumId: string;
  albumSlug?: string;
  type: "image" | "video";
  src: string;
  poster?: string;
  name: string;
  width: number;
  height: number;
  alt?: string;
};

export const brand = {
  name: "Book & Capture",
  tagline: "Photography & Videography",
  email: "hello@bookandcapture.com",
  instagramUrl: "https://instagram.com/",
  vimeoUrl: "https://vimeo.com/",
  tiktokUrl: "https://tiktok.com/",
} as const;
