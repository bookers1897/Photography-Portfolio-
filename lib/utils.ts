import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function storagePublicUrl(path: string | null | undefined) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return path;
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/media/${path.replace(/^\/+/, "")}`;
}
