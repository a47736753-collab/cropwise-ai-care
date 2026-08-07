import { ArrowRight, Globe2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const languages = ["English", "हिन्दी", "मराठी"];

export function GetStarted() {
  return (
    <section id="get-started" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-forest-800 px-6 py-16 text-center shadow-2xl shadow-forest-900/30 sm:px-12 sm:py-20">
          {/* Decorations */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-leaf-300/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-leaf-500/20 blur-3xl"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 bg-cream-50/10 px-4 py-1.5 text-xs font-semibold text-cream-50">
              <Globe2 className="h-4 w-4 text-leaf-300" aria-hidden="true" />
              {languages.join(" · ")}
            </div>

            <h2 className="mt-6 font-serif text-3xl font-semibold leading-tight tracking-tight text-cream-50 sm:text-4xl">
              Every diagnosis, treatment step and alert —{" "}
              <span className="text-leaf-300">in your own language.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-cream-100/75 sm:text-lg">
              Join thousands of farmers protecting their fields with instant,
              trustworthy crop care.
            </p>

            <div className="mt-9">
              <ButtonLink
                href="/signup"
                variant="secondary"
                size="lg"
                className="bg-cream-50 text-forest-900 ring-0 hover:bg-white"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
