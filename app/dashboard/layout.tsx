import Link from "next/link";
import { Leaf, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/dashboard/setup-notice";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="sticky top-0 z-40 border-b border-forest-900/5 bg-cream-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-cream-50">
              <Leaf className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="hidden font-serif text-lg font-semibold tracking-tight text-forest-950 sm:block">
              CropWise AI
            </span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-forest-900/70 transition-colors hover:text-forest-800"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              className="text-sm font-medium text-forest-900/70 transition-colors hover:text-forest-800"
            >
              History
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-forest-900/70 transition-colors hover:text-forest-800"
            >
              Home
            </Link>
            <form action="/api/auth/signout" method="post">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-forest-900/70 transition-colors hover:bg-forest-800/10 hover:text-forest-800"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
