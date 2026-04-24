"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "./_lib/require-admin";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

// ---- ALBUMS ----

export async function createAlbumAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;

  if (!name) throw new Error("Name required.");
  const slug = slugify(name);
  if (!slug) throw new Error("Invalid name.");

  const { data: maxRow } = await supabase
    .from("albums")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (maxRow?.position ?? -1) + 1;

  const { error } = await supabase.from("albums").insert({
    slug,
    name,
    description,
    position,
    published: true,
  });
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/albums");
  revalidatePath("/work");
  redirect(`/admin/albums/${slug}`);
}

export async function updateAlbumAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const published = formData.get("published") === "on";
  const visibilityRaw = String(formData.get("visibility") ?? "public");
  const visibility = visibilityRaw === "private" ? "private" : "public";
  const ownerIdRaw = String(formData.get("owner_id") ?? "").trim();
  const expiresAtRaw = String(formData.get("expires_at") ?? "").trim();

  if (!id || !name) throw new Error("Missing fields.");

  const owner_id =
    visibility === "private" && ownerIdRaw ? ownerIdRaw : null;
  const expires_at =
    visibility === "private" && expiresAtRaw
      ? new Date(`${expiresAtRaw}T23:59:59Z`).toISOString()
      : null;

  const { error } = await supabase
    .from("albums")
    .update({
      name,
      description,
      published,
      visibility,
      owner_id,
      expires_at,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/albums");
  revalidatePath(`/admin/albums/${formData.get("slug")}`);
  revalidatePath("/work");
  revalidatePath("/portal");
}

export async function deleteAlbumAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id.");

  const { data: items } = await supabase
    .from("media")
    .select("storage_path, poster_path")
    .eq("album_id", id);

  const paths = (items ?? [])
    .flatMap((m) => [m.storage_path, m.poster_path])
    .filter((p): p is string => !!p);

  if (paths.length) {
    await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("albums").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/albums");
  revalidatePath("/work");
  redirect("/admin/albums");
}

// ---- MEDIA ----

type InsertMediaInput = {
  album_id: string;
  type: "image" | "video";
  storage_path: string;
  poster_path?: string | null;
  name: string;
  alt?: string | null;
  width: number;
  height: number;
};

export async function insertMediaAction(
  slug: string,
  input: InsertMediaInput,
) {
  const { supabase, user } = await requireAdmin();

  const { data: maxRow } = await supabase
    .from("media")
    .select("position")
    .eq("album_id", input.album_id)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const position = (maxRow?.position ?? -1) + 1;

  const { error, data } = await supabase
    .from("media")
    .insert({
      ...input,
      position,
      uploaded_by: user.id,
      published: true,
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath(`/admin/albums/${slug}`);
  revalidatePath("/work");
  revalidatePath(`/work/${slug}`);
  return data.id as string;
}

export async function deleteMediaAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!id) throw new Error("Missing id.");

  const { data: item } = await supabase
    .from("media")
    .select("storage_path, poster_path")
    .eq("id", id)
    .single();

  const paths = [item?.storage_path, item?.poster_path].filter(
    (p): p is string => !!p,
  );
  if (paths.length) {
    await supabase.storage.from("media").remove(paths);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  if (slug) {
    revalidatePath(`/admin/albums/${slug}`);
    revalidatePath(`/work/${slug}`);
  }
  revalidatePath("/work");
}

export async function reorderMediaAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  const orderRaw = String(formData.get("order") ?? "[]");
  let ids: string[] = [];
  try {
    ids = JSON.parse(orderRaw);
  } catch {
    throw new Error("Invalid order payload.");
  }

  await Promise.all(
    ids.map((id, i) =>
      supabase.from("media").update({ position: i }).eq("id", id),
    ),
  );

  revalidatePath("/admin");
  if (slug) {
    revalidatePath(`/admin/albums/${slug}`);
    revalidatePath(`/work/${slug}`);
  }
  revalidatePath("/work");
}

export async function setAlbumCoverAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const albumId = String(formData.get("album_id") ?? "");
  const mediaId = String(formData.get("media_id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!albumId || !mediaId) throw new Error("Missing fields.");

  const { error } = await supabase
    .from("albums")
    .update({ cover_media_id: mediaId })
    .eq("id", albumId);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  if (slug) revalidatePath(`/admin/albums/${slug}`);
  revalidatePath("/work");
  revalidatePath("/");
}

export async function reorderAlbumsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const orderRaw = String(formData.get("order") ?? "[]");
  let ids: string[] = [];
  try {
    ids = JSON.parse(orderRaw);
  } catch {
    throw new Error("Invalid order payload.");
  }

  await Promise.all(
    ids.map((id, i) =>
      supabase.from("albums").update({ position: i }).eq("id", id),
    ),
  );

  revalidatePath("/admin");
  revalidatePath("/admin/albums");
  revalidatePath("/");
  revalidatePath("/work");
}

export async function updateMediaAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const altRaw = String(formData.get("alt") ?? "").trim();
  if (!id || !name) throw new Error("Missing fields.");

  const alt = altRaw || null;

  const { error } = await supabase
    .from("media")
    .update({ name, alt })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  if (slug) {
    revalidatePath(`/admin/albums/${slug}`);
    revalidatePath(`/work/${slug}`);
  }
  revalidatePath("/work");
  revalidatePath("/");
}
