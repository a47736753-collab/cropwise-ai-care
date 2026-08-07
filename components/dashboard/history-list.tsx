import Link from "next/link";
import { History, Loader2 } from "lucide-react";

interface DiagnosisRow {
  id: string;
  disease_name: string | null;
  confidence: number | null;
  severity: string | null;
  status: string | null;
  created_at: string;
}

const severityBadge: Record<string, string> = {
  low: "bg-forest-50 text-forest-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-red-50 text-red-700",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryList({ diagnoses }: { diagnoses: DiagnosisRow[] }) {
  if (diagnoses.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-3xl border border-dashed border-forest-800/20 bg-white/60 px-6 py-14 text-center">
        <History className="h-10 w-10 text-forest-300" aria-hidden="true" />
        <p className="mt-4 font-serif text-lg font-semibold text-forest-950">
          No scans yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-forest-900/60">
          Upload a leaf photo above and your diagnosis history will appear
          here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {diagnoses.map((d) => (
        <li key={d.id}>
          <Link
            href={`/dashboard/history/${d.id}`}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/5 bg-white px-5 py-4 shadow-sm transition-all hover:border-forest-800/15 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  severityBadge[d.severity ?? "medium"] ??
                  "bg-forest-50 text-forest-700"
                }`}
              >
                {d.status === "pending" ? "Analyzing" : d.status ?? "Completed"}
              </span>
              <div>
                <p className="text-sm font-semibold text-forest-950">
                  {d.status === "pending"
                    ? "Analyzing…"
                    : d.disease_name ?? "Unknown"}
                </p>
                <p className="text-xs text-forest-900/50">
                  {formatDate(d.created_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-right">
              {d.status === "pending" ? (
                <Loader2 className="h-4 w-4 animate-spin text-forest-500" aria-hidden="true" />
              ) : (
                d.confidence !== null && (
                  <p className="text-sm font-semibold text-forest-800">
                    {Math.round(d.confidence * 100)}%
                  </p>
                )
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
