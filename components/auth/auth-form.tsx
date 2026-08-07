"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { signInWithPassword, signUp } from "@/lib/auth/actions";
import { Button } from "@/components/ui/button";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState<"google" | "form" | null>(null);

  const isLogin = mode === "login";

  async function handleGoogle() {
    setLoading("google");
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(null);
    }
    // On success the browser navigates away.
  }

  async function handleSubmit(formData: FormData) {
    setLoading("form");
    setError(null);
    setInfo(null);

    const result = isLogin
      ? await signInWithPassword(formData)
      : await signUp(formData);

    if (result && "error" in result && result.error) {
      setError(result.error);
      setLoading(null);
      return;
    }
    if (result && "success" in result && result.success) {
      setInfo(result.success);
      setLoading(null);
      return;
    }
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="w-full"
        onClick={handleGoogle}
        disabled={loading !== null}
      >
        {loading === "google" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-forest-900/10" />
        <span className="text-xs font-medium uppercase tracking-wider text-forest-900/40">
          or
        </span>
        <span className="h-px flex-1 bg-forest-900/10" />
      </div>

      <form action={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-forest-900/80"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-forest-900/15 bg-white px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors placeholder:text-forest-900/35 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-forest-900/80"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={6}
            className="w-full rounded-xl border border-forest-900/15 bg-white px-4 py-2.5 text-sm text-forest-950 outline-none transition-colors placeholder:text-forest-900/35 focus:border-forest-600 focus:ring-2 focus:ring-forest-600/20"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        )}
        {info && (
          <p
            role="status"
            className="rounded-xl bg-forest-50 px-3.5 py-2.5 text-sm text-forest-800"
          >
            {info}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={loading !== null}
        >
          {loading === "form" ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <LogIn className="h-4 w-4" aria-hidden="true" />
          )}
          {isLogin ? "Sign in" : "Create account"}
        </Button>
      </form>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.62v3h3.87c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.87-3c-1.07.72-2.44 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 0 1 0-4.54v-3.1H1.29a12 12 0 0 0 0 10.74l3.98-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.98 11.98 0 0 0 1.29 6.63l3.98 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}
