import { createClient } from "@/lib/supabase/server";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { HistoryList, type ScanRow } from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: scans } = await supabase
    .from("scans")
    .select("id, detected_label, confidence, severity, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      <div className="animate-rise">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-forest-950 sm:text-4xl">
          Scan a crop leaf
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-forest-900/60 sm:text-base">
          Upload a photo of the affected leaf and get an instant AI diagnosis
          with a treatment plan.
        </p>
      </div>

      <div className="animate-rise" style={{ animationDelay: "80ms" }}>
        <UploadZone />
      </div>

      <section className="animate-rise" style={{ animationDelay: "160ms" }}>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-forest-950">
          Recent scans
        </h2>
        <div className="mt-4">
          <HistoryList scans={(scans ?? []) as ScanRow[]} />
        </div>
      </section>
    </div>
  );
}
