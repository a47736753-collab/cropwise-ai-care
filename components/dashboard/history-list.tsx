import Link from "next/link";
import { History, Loader2 } from "lucide-react";

export interface ScanRow {
  id: string;
  detected_label: string | null;
  confidence: number | null;
  severity: string | null;
  status: string | null;
  created_at: string;
}

const severityBadge: Record<string, string> = {
  low: "bg-forest-50 text-forest-700",
  moderate: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-red-50 text-red-700",
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

export function HistoryList({ scans }: { scans: ScanRow[] }) {
  if (scans.length === 0) {
    return (
      <div className="animate-rise flex flex-col items-center rounded-3xl border border-dashed border-forest-800/20 bg-white/60 px-6 py-14 text-center">
        <History className="h-10 w-10 text-forest-300" aria-hidden="true" />
        <p className="mt-4 font-serif text-lg font-semibold text-forest-950">
          No scans yet
        </p>
        <p className="mt-1 max-w-sm text-sm text-forest-900/60">
          Upload a leaf photo above and your diagnosis history will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {scans.map((scan, i) => {
        const pending = scan.status === "pending" || scan.status === "analyzing";
        return (
          <li
            key={scan.id}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
          >
            <Link
              href={`/dashboard/history/${scan.id}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/5 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-forest-800/15 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                    severityBadge[scan.severity ?? "moderate"] ??
                    "bg-forest-50 text-forest-700"
                  }`}
                >
                  {pending ? "Analyzing" : scan.severity ?? "Completed"}
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-950">
                    {pending
                      ? "Analyzing…"
                      : scan.detected_label ?? "Unknown"}
                  </p>
                  <p className="text-xs text-forest-900/50">
                    {formatDate(scan.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                {pending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin text-forest-500"
                    aria-hidden="true"
                  />
                ) : (
                  scan.confidence !== null && (
                    <p className="text-sm font-semibold text-forest-800">
                      {Math.round(Number(scan.confidence) * 100)}%
                    </p>
                  )
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
