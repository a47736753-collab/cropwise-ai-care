import { Camera, ListChecks, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    icon: Camera,
    step: "Step 1",
    title: "Snap a photo of the leaf",
    description:
      "Open the camera or upload a picture of the affected crop. Any phone works — no special equipment needed.",
  },
  {
    icon: Sparkles,
    step: "Step 2",
    title: "Get an instant diagnosis",
    description:
      "Our AI identifies the disease, shows a confidence score and flags severity — in under 10 seconds, in your language.",
  },
  {
    icon: ListChecks,
    step: "Step 3",
    title: "Follow your treatment plan",
    description:
      "Receive a step-by-step organic and chemical plan with prevention tips, plus reminders and weather alerts.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From leaf to treatment plan in three steps"
          description="No agronomy degree required. If you can photograph a leaf, you can save your crop."
        />

        <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* Connector line (desktop) */}
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-forest-200 md:block"
          />

          {steps.map((step) => (
            <div key={step.step} className="relative text-center">
              <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-800 text-cream-50 shadow-lg shadow-forest-900/25 ring-8 ring-cream-50">
                <step.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-forest-600">
                {step.step}
              </p>
              <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight text-forest-950">
                {step.title}
              </h3>
              <p className="mx-auto mt-2.5 max-w-xs text-sm leading-relaxed text-forest-900/65">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
