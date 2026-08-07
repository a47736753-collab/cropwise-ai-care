"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  ImagePlus,
  Loader2,
  ScanLine,
  Sprout,
  X,
} from "lucide-react";
import type { AnalysisResult } from "@/lib/gemini/analyze";

const severityStyles: Record<string, string> = {
  low: "border-forest-200 bg-forest-50 text-forest-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-red-200 bg-red-50 text-red-700",
};

export function UploadZone() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selected: File | null) => {
    if (!selected) return;
    if (!selected.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG or WebP).");
      return;
    }
    setError(null);
    setResult(null);
    setChecked({});
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }, []);

  async function analyze() {
    if (!file) return;
    setAnalyzing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/diagnose", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Analysis failed. Please try again.");
      }
      setResult(data as AnalysisResult);
      // Refresh the server-rendered history list below.
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setAnalyzing(false);
    }
  }

  function reset() {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    setChecked({});
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Upload card */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="group cursor-pointer rounded-3xl border-2 border-dashed border-forest-800/20 bg-white/60 p-10 text-center transition-all hover:border-forest-600 hover:bg-white"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          <div className="relative mx-auto max-w-sm overflow-hidden rounded-2xl">
            <Image
              src={preview}
              alt="Selected leaf"
              width={640}
              height={480}
              className="h-64 w-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                reset();
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-forest-950/70 text-cream-50 transition-colors hover:bg-forest-950"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <div className="mx-auto flex max-w-sm flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-100 text-forest-700 transition-colors group-hover:bg-forest-800 group-hover:text-cream-50">
              <ImagePlus className="h-8 w-8" aria-hidden="true" />
            </span>
            <p className="mt-4 font-serif text-lg font-semibold text-forest-950">
              Drop a leaf photo here
            </p>
            <p className="mt-1 text-sm text-forest-900/60">
              or click to browse — JPG, PNG or WebP
            </p>
          </div>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {file && !result && (
        <button
          type="button"
          onClick={analyze}
          disabled={analyzing}
          className="inline-flex items-center gap-2 rounded-full bg-forest-800 px-7 py-3.5 text-base font-semibold text-cream-50 shadow-lg shadow-forest-900/20 transition-all hover:bg-forest-900 disabled:opacity-60"
        >
          {analyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Analyzing leaf…
            </>
          ) : (
            <>
              <ScanLine className="h-5 w-5" aria-hidden="true" />
              Analyze leaf
            </>
          )}
        </button>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-3xl border border-forest-900/5 bg-white p-6 shadow-lg shadow-forest-900/10 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-100 text-forest-700">
                <Sprout className="h-6 w-6" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-medium text-forest-900/50">
                  Diagnosis
                </p>
                <h3 className="font-serif text-xl font-semibold text-forest-950">
                  {result.diseaseName}
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs font-medium text-forest-900/50">
                  Confidence
                </p>
                <p className="font-serif text-2xl font-semibold text-forest-800">
                  {Math.round(result.confidence * 100)}%
                </p>
              </div>
              <span
                className={`rounded-full border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${severityStyles[result.severity]}`}
              >
                {result.severity}
              </span>
            </div>
          </div>

          {result.reasoning && (
            <p className="mt-5 rounded-2xl bg-cream-100/70 px-4 py-3 text-sm leading-relaxed text-forest-900/75">
              {result.reasoning}
            </p>
          )}

          {/* Treatment plan */}
          {result.treatmentSteps.length > 0 && (
            <div className="mt-7">
              <h4 className="flex items-center gap-2 font-serif text-lg font-semibold text-forest-950">
                <Droplets className="h-5 w-5 text-forest-600" aria-hidden="true" />
                Treatment plan
              </h4>
              <ol className="mt-4 space-y-3">
                {result.treatmentSteps.map((step) => (
                  <li
                    key={step.order}
                    className={`flex items-start gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                      checked[step.order]
                        ? "border-forest-200 bg-forest-50"
                        : "border-forest-900/10 bg-white"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setChecked((c) => ({
                          ...c,
                          [step.order]: !c[step.order],
                        }))
                      }
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                        checked[step.order]
                          ? "border-forest-600 bg-forest-600 text-cream-50"
                          : "border-forest-900/25 hover:border-forest-600"
                      }`}
                      aria-label={
                        checked[step.order]
                          ? `Mark step ${step.order} as not done`
                          : `Mark step ${step.order} as done`
                      }
                    >
                      {checked[step.order] && (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-semibold text-forest-950 ${
                          checked[step.order] ? "line-through opacity-60" : ""
                        }`}
                      >
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

          {/* Prevention */}
          {result.prevention.length > 0 && (
            <div className="mt-7">
              <h4 className="font-serif text-lg font-semibold text-forest-950">
                Prevention tips
              </h4>
              <ul className="mt-3 space-y-2">
                {result.prevention.map((tip, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 text-sm text-forest-900/70"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-600" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-forest-900/20 px-5 py-2.5 text-sm font-semibold text-forest-900 transition-colors hover:bg-forest-800/5"
            >
              Scan another leaf
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
