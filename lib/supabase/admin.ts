import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role Supabase client. Bypasses RLS.
// Use only in server actions / route handlers for admin-only operations
// (e.g., supabase.auth.admin.createUser). Never import from a client
// component or any file that ends up in the client bundle.
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin client not configured (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing).",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
