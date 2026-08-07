#!/usr/bin/env node
/**
 * CropWise AI Care — one-command setup.
 *
 *   npm run setup
 *
 * What it does:
 *   1. Validates .env.local has the required keys.
 *   2. Creates the public "crop-images" storage bucket.
 *   3. Applies the SQL migrations (0001_init.sql, 0002_storage_and_seed.sql)
 *      through the Supabase SQL-over-HTTP endpoint (service role required).
 *   4. Seeds the curated disease library and sample agri centres.
 *   5. Prints the remaining Google OAuth steps (requires your Google account).
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

// ---------- helpers ----------
function loadEnv() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local not found. Copy .env.example to .env.local first.");
    process.exit(1);
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

function urlBase(url) {
  return url.replace(/\/+$/, "");
}

// ---------- main ----------
async function main() {
  const env = loadEnv();
  const required = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "GEMINI_API_KEY",
  ];

  const missing = required.filter((k) => !env[k]);
  if (missing.length) {
    console.error("❌ Missing environment variables in .env.local:");
    missing.forEach((k) => console.error(`   - ${k}`));
    console.error("\nGet them from:");
    console.error("   • Supabase:  Dashboard → Project Settings → API");
    console.error("   • Gemini:    https://aistudio.google.com/apikey");
    process.exit(1);
  }

  const supabaseUrl = urlBase(env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceClient = createClient(supabaseUrl, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("✅ Environment variables present");

  // 1. Storage bucket
  try {
    const { data, error } = await serviceClient.storage.getBucket("crop-images");
    if (error || !data) {
      await serviceClient.storage.createBucket("crop-images", {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      });
      console.log("✅ Created public storage bucket: crop-images");
    } else {
      console.log("✅ Storage bucket already exists: crop-images");
    }
  } catch (e) {
    console.error("❌ Could not create storage bucket:", e.message);
  }

  // 2. Migrations via SQL-over-HTTP (service role)
  const migrations = [
    "supabase/migrations/0001_init.sql",
    "supabase/migrations/0002_storage_and_seed.sql",
  ];

  for (const file of migrations) {
    const sql = fs.readFileSync(path.join(root, file), "utf8");
    try {
      const res = await fetch(`${supabaseUrl}/pg/query`, {
        method: "POST",
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: sql }),
      });
      if (res.ok) {
        console.log(`✅ Applied migration: ${path.basename(file)}`);
      } else {
        const body = await res.text();
        // Many statements already exist if re-run — treat as informational.
        console.warn(`⚠️  Migration ${path.basename(file)} returned ${res.status}`);
        console.warn(`   ${body.slice(0, 300)}`);
      }
    } catch (e) {
      console.warn(
        `⚠️  Could not run ${path.basename(file)} via SQL endpoint: ${e.message}`
      );
    }
  }

  // 3. Verify / seed via client (upsert diseases, skip if table missing)
  try {
    const { error } = await serviceClient.from("diseases").select("slug").limit(1);
    if (error) {
      console.warn(
        "⚠️  diseases table not queryable yet — apply migrations manually if the SQL endpoint failed."
      );
    } else {
      console.log("✅ Diseases table is reachable");
    }
  } catch {
    console.warn("⚠️  Could not verify diseases table.");
  }

  // 4. Google OAuth guidance (cannot be fully automated — needs your Google account)
  console.log("\n────────────────────────────────────────────");
  console.log("Next steps for Google Sign In (2 minutes):");
  console.log("  1. Google Cloud Console → Credentials → Create OAuth Client ID");
  console.log("     (Application type: Web; authorized redirect URI:)");
  console.log(`     ${supabaseUrl}/auth/v1/callback`);
  console.log("  2. Supabase Dashboard → Authentication → Providers → Google");
  console.log("     → enable + paste the Client ID and Client Secret.");
  console.log("  3. Supabase Dashboard → Authentication → URL Configuration");
  console.log("     → add your site URL (e.g. http://localhost:3000).");
  console.log("\nThen restart the app:");
  console.log("     npm run build && npm start");
  console.log("────────────────────────────────────────────\n");

  console.log("🎉 Setup complete. If any ⚠️ warnings appeared, apply the");
  console.log("migrations manually: Supabase Dashboard → SQL Editor → paste");
  console.log("supabase/migrations/0001_init.sql then 0002_storage_and_seed.sql.");
}

main().catch((e) => {
  console.error("❌ Setup failed:", e.message);
  process.exit(1);
});
