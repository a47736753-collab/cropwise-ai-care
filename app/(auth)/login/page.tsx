import Link from "next/link";
import { Leaf } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { SetupNotice } from "@/components/dashboard/setup-notice";

export default function LoginPage() {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-cream-50 px-4 py-16">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-md shadow-forest-900/20">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-xl font-semibold tracking-tight text-forest-950">
            CropWise AI
          </span>
        </Link>

        <h1 className="mt-8 font-serif text-3xl font-semibold tracking-tight text-forest-950">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-forest-900/60">
          Sign in to scan crops and manage your farm health.
        </p>

        <div className="mt-8 text-left">
          <AuthForm mode="login" />
        </div>

        <p className="mt-6 text-sm text-forest-900/60">
          New here?{" "}
          <Link
            href="/signup"
            className="font-semibold text-forest-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
