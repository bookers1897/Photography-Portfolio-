"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireClientAuth() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  return { supabase, user };
}
