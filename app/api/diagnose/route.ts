import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeLeafImage } from "@/lib/gemini/analyze";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ensureCropImagesBucket } from "@/lib/supabase/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add env vars to .env.local." },
      { status: 500 }
    );
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured. Add it to .env.local." },
      { status: 500 }
    );
  }

  let imageBase64: string;
  let mimeType: string;

  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file (JPG, PNG or WebP)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    imageBase64 = buffer.toString("base64");
    mimeType = file.type || "image/jpeg";
  } catch {
    return NextResponse.json(
      { error: "Invalid upload payload" },
      { status: 400 }
    );
  }

  // Insert a pending record first so history shows uploads in flight.
  const { data: pending } = await supabase
    .from("diagnoses")
    .insert({
      user_id: user.id,
      disease_name: "Analyzing…",
      confidence: 0,
      severity: "medium",
      status: "pending",
    })
    .select()
    .single();

  let imageUrl: string | null = null;
  await ensureCropImagesBucket();
  try {
    const { data: uploaded } = await supabase.storage
      .from("crop-images")
      .upload(
        `diagnoses/${user.id}/${Date.now()}.jpg`,
        Buffer.from(imageBase64, "base64"),
        { contentType: mimeType, upsert: false }
      );
    if (uploaded) {
      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/crop-images/${uploaded.path}`;
    }
  } catch {
    // Storage bucket may not exist — proceed without storing the image.
  }

  try {
    const result = await analyzeLeafImage(imageBase64, mimeType);

    const recordId = pending?.id ?? undefined;
    const insert = {
      user_id: user.id,
      image_url: imageUrl,
      disease_name: result.diseaseName,
      confidence: result.confidence,
      severity: result.severity,
      status: "completed" as const,
    };

    const { data: saved } = recordId
      ? await supabase
          .from("diagnoses")
          .update(insert)
          .eq("id", recordId)
          .select()
          .single()
      : await supabase.from("diagnoses").insert(insert).select().single();

    if (saved) {
      await supabase.from("treatment_plans").insert({
        diagnosis_id: saved.id,
        steps: result.treatmentSteps.map((step) => ({
          ...step,
          completed: false,
        })),
      });
    }

    return NextResponse.json({
      ...result,
      id: saved?.id ?? null,
      imageUrl,
    });
  } catch (error) {
    if (pending?.id) {
      await supabase
        .from("diagnoses")
        .update({ status: "failed", disease_name: "Analysis failed" })
        .eq("id", pending.id);
    }
    const message =
      error instanceof Error ? error.message : "AI analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
