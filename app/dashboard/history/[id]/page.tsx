import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Droplets, ShieldCheck, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const severityStyles: Record<string, string> = {
  low: "border-forest-200 bg-forest-50 text-forest-700",
  moderate: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-orange-200 bg-orange-50 text-orange-700",
  critical: "border-red-200 bg-red-50 text-red-700",
};

export default async function ScanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: scan } = await supabase
    .from("scans")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!scan) {
    notFound();
  }

  const { data: steps } = await supabase
    .from("treatment_steps")
    .select("id, step_order, title, detail, completed_at")
    .eq("scan_id", id)
    .order("step_order", { ascending: true });

  // The leaf-images bucket is private — mint a short-lived signed URL.
  let imageUrl: string | null = null;
  if (scan.image_path) {
    const { data: signed } = await supabase.storage
      .from("leaf-images")
      .createSignedUrl(scan.image_path, 60 * 60);
    imageUrl = signed?.signedUrl ?? null;
  }

  const prevention: string[] = Array.isArray(
    (scan.ai_raw as { prevention?: unknown } | null)?.prevention
  )
    ? ((scan.ai_raw as { prevention: unknown[] }).prevention.map(String))
    : [];
  const fertilizer =
    (scan.ai_raw as { fertilizerAdvice?: string } | null)?.fertilizerAdvice ??
    "";

  return (
    <div className="animate-rise space-y-8">
      <Link
        href="/dashboard/history"
        className="inline-flex items-center gap-2 text-sm font-medium text-forest-900/60 transition-colors hover:text-forest-800"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to history
      </Link>

      <div className="rounded-3xl border border-forest-900/5 bg-white p-6 shadow-lg shadow-forest-900/10 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-100 text-forest-700">
              <Sprout className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-forest-900/50">Diagnosis</p>
              <h1 className="font-serif text-2xl font-semibold text-forest-950">
                {scan.detected_label ?? "Unknown"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {scan.confidence !== null && (
              <div className="text-right">
                <p className="text-xs font-medium text-forest-900/50">
                  Confidence
                </p>
                <p className="font-serif text-2xl font-semibold text-forest-800">
                  {Math.round(Number(scan.confidence) * 100)}%
                </p>
              </div>
            )}
            {scan.severity && (
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  severityStyles[scan.severity] ?? severityStyles.moderate
                }`}
              >
                {scan.severity}
              </span>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="mt-6 overflow-hidden rounded-2xl">
            <Image
              src={imageUrl}
              alt="Scanned leaf"
              width={960}
              height={640}
              unoptimized
              className="h-72 w-full object-cover"
            />
          </div>
        )}

        {scan.ai_summary && (
          <p className="mt-6 rounded-2xl bg-cream-100/70 px-4 py-3 text-sm leading-relaxed text-forest-900/75">
            {scan.ai_summary}
          </p>
        )}

        {steps && steps.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-forest-950">
              <Droplets className="h-5 w-5 text-forest-600" aria-hidden="true" />
              Treatment timeline
            </h2>
            <ol className="mt-4 space-y-3">
              {steps.map((step) => (
                <li
                  key={step.id}
                  className="rounded-2xl border border-forest-900/10 bg-white px-4 py-3"
                >
                  <p className="text-sm font-semibold text-forest-950">
                    {step.step_order}. {step.title}
                  </p>
                  {step.detail && (
                    <p className="mt-0.5 text-sm text-forest-900/60">
                      {step.detail}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </div>
        )}

        {prevention.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-forest-950">
              <ShieldCheck
                className="h-5 w-5 text-forest-600"
                aria-hidden="true"
              />
              Prevention
            </h2>
            <ul className="mt-3 space-y-2">
              {prevention.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-forest-900/70">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {fertilizer && (
          <div className="mt-8 rounded-2xl bg-forest-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-forest-700">
              Fertilizer advice
            </p>
            <p className="mt-1 text-sm text-forest-900/75">{fertilizer}</p>
          </div>
        )}
      </div>
    </div>
  );
}
