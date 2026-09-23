import { createClient } from "@/lib/supabase/server";
import { HistoryList, type ScanRow } from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const supabase = await createClient();

  const { data: scans } = await supabase
    .from("scans")
    .select("id, detected_label, confidence, severity, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="animate-rise">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-forest-950 sm:text-4xl">
          Scan history
        </h1>
        <p className="mt-2 text-sm text-forest-900/60 sm:text-base">
          Every diagnosis you have run, newest first.
        </p>
      </div>
      <HistoryList scans={(scans ?? []) as ScanRow[]} />
    </div>
  );
}
