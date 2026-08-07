import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Droplets, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

interface TreatmentStep {
  order: number;
  title: string;
  description: string;
  completed?: boolean;
}

const severityStyles: Record<string, string> = {
  low: "border-forest-200 bg-forest-50 text-forest-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-red-200 bg-red-50 text-red-700",
};

export default async function DiagnosisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: diagnosis } = await supabase
    .from("diagnoses")
    .select("*")
    .eq("id", id)
    .single();

  if (!diagnosis) {
    notFound();
  }

  const { data: plan } = await supabase
    .from("treatment_plans")
    .select("steps")
    .eq("diagnosis_id", id)
    .single();

  const steps: TreatmentStep[] = Array.isArray(plan?.steps)
    ? (plan.steps as TreatmentStep[])
    : [];

  return (
    <div className="space-y-6">
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
                {diagnosis.disease_name}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-medium text-forest-900/50">Confidence</p>
              <p className="font-serif text-2xl font-semibold text-forest-800">
                {diagnosis.confidence !== null
                  ? `${Math.round(diagnosis.confidence * 100)}%`
                  : "—"}
              </p>
            </div>
            {diagnosis.severity && (
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                  severityStyles[diagnosis.severity] ?? "bg-cream-100 text-forest-900"
                }`}
              >
                {diagnosis.severity}
              </span>
            )}
          </div>
        </div>

        {diagnosis.image_url && (
          <Image
            src={diagnosis.image_url}
            alt="Scanned leaf"
            width={640}
            height={480}
            className="mt-6 h-64 w-full rounded-2xl object-cover sm:h-80"
            unoptimized
          />
        )}

        <p className="mt-5 text-sm text-forest-900/50">
          Scanned on{" "}
          {new Date(diagnosis.created_at).toLocaleString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {steps.length > 0 && (
        <div className="rounded-3xl border border-forest-900/5 bg-white p-6 shadow-lg shadow-forest-900/10 sm:p-8">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-forest-950">
            <Droplets className="h-5 w-5 text-forest-600" aria-hidden="true" />
            Treatment plan
          </h2>
          <ol className="mt-5 space-y-3">
            {steps.map((step) => (
              <li
                key={step.order}
                className="flex items-start gap-3 rounded-2xl border border-forest-900/10 bg-white px-4 py-3"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-700">
                  {step.order}
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-950">
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-sm text-forest-900/60">
                      {step.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
