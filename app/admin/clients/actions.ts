"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "../_lib/require-admin";

function generatePassword(length = 16) {
  const alphabet =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export type InviteState = {
  ok?: boolean;
  email?: string;
  tempPassword?: string;
  error?: string;
};

export async function inviteClientAction(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  try {
    await requireAdmin();
  } catch (err) {
    return {
      error:
        err instanceof Error ? err.message : "Unauthorized.",
    };
  }

  const rawEmail = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!rawEmail || !rawEmail.includes("@")) {
    return { error: "Enter a valid email." };
  }

  const admin = createSupabaseAdminClient();
  const password = generatePassword(16);

  const { data: created, error: createErr } =
    await admin.auth.admin.createUser({
      email: rawEmail,
      password,
      email_confirm: true,
    });

  if (createErr || !created.user) {
    return {
      error:
        createErr?.message ??
        "Could not create user.",
    };
  }

  const { error: profileErr } = await admin
    .from("profiles")
    .upsert(
      { id: created.user.id, email: rawEmail, role: "client" },
      { onConflict: "id" },
    );

  if (profileErr) {
    return { error: profileErr.message };
  }

  revalidatePath("/admin/clients");
  return { ok: true, email: rawEmail, tempPassword: password };
}

export async function resetClientPasswordAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing id.");

  const admin = createSupabaseAdminClient();
  const password = generatePassword(16);
  const { error } = await admin.auth.admin.updateUserById(id, { password });
  if (error) throw new Error(error.message);

  revalidatePath("/admin/clients");
  return { password };
}
