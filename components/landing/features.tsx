import {
  BookOpen,
  CalendarCheck2,
  CloudRainWind,
  MapPin,
  MessageCircle,
  ScanLine,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  {
    icon: ScanLine,
    title: "AI leaf diagnosis",
    description:
      "Upload a photo and get the disease name, severity and a calibrated confidence score.",
  },
  {
    icon: BookOpen,
    title: "Curated disease library",
    description:
      "Symptoms, causes, organic and chemical treatments, and prevention for every crop disease.",
  },
  {
    icon: CalendarCheck2,
    title: "Treatment timeline",
    description:
      "A step-by-step, checkable plan so nothing in the spray schedule is missed.",
  },
  {
    icon: CloudRainWind,
    title: "Weather-aware alerts",
    description:
      "Warnings when humidity and rainfall create ideal conditions for an outbreak.",
  },
  {
    icon: MessageCircle,
    title: "Agriculture chatbot",
    description:
      "Ask anything about crops, soil or fertilizer and get grounded, practical answers.",
  },
  {
    icon: MapPin,
    title: "Nearby agri centres",
    description:
      "Find the closest krishi kendra, soil lab or input dealer when you need help in person.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything a farmer needs, in one app"
          description="From instant diagnosis to daily treatment reminders — built around how farming actually works."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-forest-900/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-forest-800/15 hover:shadow-xl hover:shadow-forest-900/10"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest-100 text-forest-700 transition-colors duration-300 group-hover:bg-forest-800 group-hover:text-cream-50">
                <feature.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-serif text-xl font-semibold tracking-tight text-forest-950">
                {feature.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-forest-900/65">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
