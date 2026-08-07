import {
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Leaf,
  ScanLine,
  Sprout,
} from "lucide-react";

export function DiagnosisCard() {
  return (
    <div className="relative w-full max-w-md">
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-leaf-300/40 via-forest-200/40 to-cream-300/40 blur-2xl"
      />

      <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-2xl shadow-forest-900/20 backdrop-blur">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-forest-900/5 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-100 text-forest-700">
              <ScanLine className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-medium text-forest-900/50">
                Diagnosis complete
              </p>
              <p className="text-sm font-semibold text-forest-950">
                Tomato — Early Blight
              </p>
            </div>
          </div>
          <span className="rounded-full bg-leaf-300/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-800">
            <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-forest-600 align-middle" />
            Live demo
          </span>
        </div>

        <div className="space-y-4 px-6 py-5">
          {/* Pathogen */}
          <div className="flex items-center justify-between rounded-2xl bg-cream-100/70 px-4 py-3">
            <div className="flex items-center gap-3">
              <Sprout className="h-5 w-5 text-forest-600" aria-hidden="true" />
              <div>
                <p className="text-xs text-forest-900/50">Pathogen</p>
                <p className="text-sm font-semibold text-forest-950">
                  Alternaria solani
                </p>
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div>
            <div className="mb-1.5 flex items-end justify-between">
              <p className="text-xs font-medium text-forest-900/50">
                Confidence
              </p>
              <p className="font-serif text-2xl font-semibold text-forest-800">
                94%
              </p>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-forest-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-500 to-forest-700"
                style={{ width: "94%" }}
              />
            </div>
          </div>

          {/* Severity */}
          <div className="flex items-start gap-3 rounded-2xl border border-red-200/70 bg-red-50/70 px-4 py-3">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-red-500"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-red-700">
                Severity: high — treat within 48 hours
              </p>
              <p className="text-xs text-red-600/70">
                Early intervention is critical to protect the crop.
              </p>
            </div>
          </div>

          {/* Treatment */}
          <div className="flex items-start gap-3 rounded-2xl bg-forest-50 px-4 py-3">
            <Droplets
              className="mt-0.5 h-5 w-5 shrink-0 text-forest-600"
              aria-hidden="true"
            />
            <div>
              <p className="text-sm font-semibold text-forest-900">
                Organic option: neem oil spray
              </p>
              <p className="text-xs text-forest-900/60">
                Apply every 5 days. View the full 14-day plan below.
              </p>
            </div>
          </div>

          {/* Action */}
          <div className="flex items-center justify-center gap-2 rounded-full bg-forest-800 py-3 text-sm font-semibold text-cream-50">
            <CheckCircle2 className="h-4 w-4 text-leaf-300" aria-hidden="true" />
            Treatment plan ready
          </div>
        </div>

        {/* Decorative leaf */}
        <Leaf
          aria-hidden="true"
          className="absolute -bottom-6 -right-6 h-24 w-24 rotate-12 text-forest-800/5"
        />
      </div>
    </div>
  );
}
