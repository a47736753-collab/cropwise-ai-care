import { createClient } from "@/lib/supabase/server";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { HistoryList } from "@/components/dashboard/history-list";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: diagnoses } = await supabase
    .from("diagnoses")
    .select("id, disease_name, confidence, severity, status, image_url, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-forest-950 sm:text-4xl">
          Scan a crop leaf
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-forest-900/60 sm:text-base">
          Upload a photo of the affected leaf and get an instant AI diagnosis
          with a treatment plan.
        </p>
      </div>

      <UploadZone />

      <section>
        <h2 className="font-serif text-2xl font-semibold tracking-tight text-forest-950">
          Recent scans
        </h2>
        <div className="mt-4">
          <HistoryList diagnoses={diagnoses ?? []} />
        </div>
      </section>
    </div>
  );
}
