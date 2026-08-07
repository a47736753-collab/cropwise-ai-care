import { ArrowRight, BookOpen, Globe, Timer } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { DiagnosisCard } from "@/components/landing/diagnosis-card";

const stats = [
  {
    icon: Globe,
    label: "Languages supported",
    value: "3",
  },
  {
    icon: BookOpen,
    label: "Curated diseases",
    value: "Curated",
  },
  {
    icon: Timer,
    label: "Average diagnosis",
    value: "Under 10s",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-32 sm:pt-36 lg:pb-24"
    >
      {/* Background decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[32rem] w-[32rem] rounded-full bg-forest-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[-15%] h-[28rem] w-[28rem] rounded-full bg-leaf-300/30 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left column */}
        <div className="max-w-xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-800/15 bg-white/70 px-4 py-1.5 text-xs font-semibold text-forest-800 shadow-sm">
            <SproutBadge />
            Built for Smart India Hackathon
          </span>

          <h1 className="mt-6 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-forest-950 sm:text-5xl lg:text-6xl">
            Photograph a leaf.{" "}
            <span className="text-forest-600">Know the disease</span> in
            seconds.
          </h1>

          <p className="mt-6 text-base leading-relaxed text-forest-900/70 sm:text-lg">
            Upload a crop photo and get an AI diagnosis with a confidence score,
            treatment plan, fertilizer guidance and prevention steps — in your
            own language.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/dashboard" size="lg">
              Scan a crop leaf
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink href="/signup" variant="outline" size="lg">
              Get started free
            </ButtonLink>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-3 rounded-2xl border border-forest-900/5 bg-white/70 px-4 py-3 shadow-sm backdrop-blur"
              >
                <stat.icon
                  className="h-5 w-5 shrink-0 text-forest-600"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold leading-tight text-forest-950">
                    {stat.value}
                  </p>
                  <p className="text-xs text-forest-900/50">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — demo card */}
        <div className="flex justify-center lg:justify-end">
          <DiagnosisCard />
        </div>
      </div>
    </section>
  );
}

function SproutBadge() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
      <path
        d="M10 18c0-4-3.5-6.5-7.5-7 0-3 2.5-5.5 5.5-6C9 3 10 1.5 10 1.5S11 3 12 5c3 .5 5.5 3 5.5 6-4 .5-7.5 3-7.5 7Z"
        fill="currentColor"
      />
    </svg>
  );
}
