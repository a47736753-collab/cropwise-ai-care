import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { analyzeLeafImage } from "@/lib/gemini/analyze";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "The backend is not configured yet." },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Please sign in again to run a scan." },
      { status: 401 }
    );
  }

  // ---------- read the upload ----------
  let buffer: Buffer;
  let mimeType: string;
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Please upload an image file (JPG, PNG or WebP)" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "That photo is larger than 10 MB. Please pick a smaller one." },
        { status: 400 }
      );
    }

    buffer = Buffer.from(await file.arrayBuffer());
    mimeType = file.type || "image/jpeg";
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }

  // ---------- store the photo (private bucket, per-user folder) ----------
  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  const imagePath = `${user.id}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("leaf-images")
    .upload(imagePath, buffer, { contentType: mimeType, upsert: false });

  if (uploadError) {
    return NextResponse.json(
      { error: "We could not save that photo. Please try again." },
      { status: 500 }
    );
  }

  // ---------- create the scan record up-front so history shows it ----------
  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .insert({
      user_id: user.id,
      image_path: imagePath,
      status: "analyzing",
      is_healthy: false,
    })
    .select("id")
    .single();

  if (scanError || !scan) {
    return NextResponse.json(
      { error: "Could not start the scan. Please try again." },
      { status: 500 }
    );
  }

  try {
    const result = await analyzeLeafImage(buffer.toString("base64"), mimeType);

    // Match the AI result against the curated disease library.
    let diseaseId: string | null = null;
    if (result.diseaseSlug) {
      const { data: disease } = await supabase
        .from("diseases")
        .select("id")
        .eq("slug", result.diseaseSlug)
        .maybeSingle();
      diseaseId = disease?.id ?? null;
    }

    await supabase
      .from("scans")
      .update({
        disease_id: diseaseId,
        crop: result.crop,
        status: "completed",
        detected_label: result.diseaseName,
        confidence: result.confidence,
        severity: result.severity,
        is_healthy: result.isHealthy,
        ai_summary: result.reasoning,
        ai_raw: result as unknown as Record<string, unknown>,
        model_version: result.modelVersion,
      })
      .eq("id", scan.id);

    if (result.treatmentSteps.length > 0) {
      await supabase.from("treatment_steps").insert(
        result.treatmentSteps.map((step) => ({
          scan_id: scan.id,
          user_id: user.id,
          step_order: step.order,
          title: step.title,
          detail: step.description,
        }))
      );
    }

    return NextResponse.json({ ...result, id: scan.id });
  } catch (error) {
    await supabase
      .from("scans")
      .update({ status: "failed", detected_label: "Analysis failed" })
      .eq("id", scan.id);

    const message =
      error instanceof Error ? error.message : "AI analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
