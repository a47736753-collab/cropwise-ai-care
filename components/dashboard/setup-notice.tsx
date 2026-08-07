import { Settings2 } from "lucide-react";

export function SetupNotice() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-50 px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-3xl border border-forest-900/5 bg-white p-8 shadow-lg shadow-forest-900/10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
          <Settings2 className="h-7 w-7" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-serif text-2xl font-semibold tracking-tight text-forest-950">
          Almost there — one-time setup needed
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-forest-900/70">
          This app connects to Supabase for authentication, storage and history,
          and Google Gemini for AI diagnosis. Add your keys to{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-xs text-forest-800">
            .env.local
          </code>{" "}
          using the template in{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-xs text-forest-800">
            .env.example
          </code>
          , then run{" "}
          <code className="rounded bg-cream-100 px-1.5 py-0.5 font-mono text-xs font-semibold text-forest-800">
            npm run setup
          </code>{" "}
          to create the storage bucket, apply migrations and seed the disease
          library automatically.
        </p>
        <ul className="mt-5 space-y-2 text-left text-sm text-forest-900/70">
          <li className="rounded-xl bg-cream-100/70 px-4 py-2.5">
            <strong className="text-forest-950">NEXT_PUBLIC_SUPABASE_URL</strong>{" "}
            — your Supabase project URL
          </li>
          <li className="rounded-xl bg-cream-100/70 px-4 py-2.5">
            <strong className="text-forest-950">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </strong>{" "}
            — public anon key
          </li>
          <li className="rounded-xl bg-cream-100/70 px-4 py-2.5">
            <strong className="text-forest-950">GEMINI_API_KEY</strong> — AI
            diagnosis engine
          </li>
        </ul>
        <p className="mt-5 text-xs text-forest-900/50">
          <code className="font-mono text-forest-700">npm run setup</code>{" "}
          handles migrations, the{" "}
          <code className="font-mono text-forest-700">crop-images</code> bucket
          and seed data. It will also print the 3 remaining steps to enable
          Google Sign In (OAuth client + provider config).
        </p>
      </div>
    </div>
  );
}
