import { createClient } from "@supabase/supabase-js";

let ensured = false;

/**
 * Ensure the public "crop-images" bucket exists.
 * Uses the service role key so it can self-heal at runtime; no-ops when the
 * service role key is not configured (bucket creation is then done via
 * `npm run setup` or the SQL migration). Never throws — callers treat a
 * failure as \"proceed without storing the image\".
 */
export async function ensureCropImagesBucket(): Promise<boolean> {
  if (ensured) return true;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) return false;

  try {
    const admin = createClient(url, serviceRole, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data } = await admin.storage.getBucket("crop-images");
    if (data) {
      ensured = true;
      return true;
    }

    const { error } = await admin.storage.createBucket("crop-images", {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    });
    ensured = !error;
    return ensured;
  } catch {
    return false;
  }
}
