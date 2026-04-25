"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../_lib/require-admin";

function clampPct(value: number) {
  if (Number.isNaN(value)) return 50;
  return Math.max(0, Math.min(100, value));
}

function clampUnit(value: number) {
  if (Number.isNaN(value)) return 0.35;
  return Math.max(0, Math.min(1, value));
}

export async function setHeroAction(formData: FormData) {
  const { supabase } = await requireAdmin();

  const heroMediaIdRaw = String(formData.get("hero_media_id") ?? "").trim();
  const focalX = clampPct(Number(formData.get("focal_x")));
  const focalY = clampPct(Number(formData.get("focal_y")));
  const overlay = clampUnit(Number(formData.get("overlay")));

  const hero_media_id = heroMediaIdRaw || null;

  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        id: true,
        hero_media_id,
        hero_focal_x: focalX,
        hero_focal_y: focalY,
        hero_overlay: overlay,
      },
      { onConflict: "id" },
    );
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/settings");
}
