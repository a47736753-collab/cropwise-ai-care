import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST() {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
    );
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  return NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
  );
}
