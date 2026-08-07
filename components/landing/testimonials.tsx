import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const testimonials = [
  {
    quote:
      "I photographed a wilted tomato leaf and within seconds I knew it was early blight. The neem spray plan saved my entire plot.",
    name: "Ramesh Patil",
    role: "Tomato farmer, Nashik",
    initials: "RP",
  },
  {
    quote:
      "Everything is in Marathi, which my father understands easily. We no longer have to wait days for the extension officer.",
    name: "Sunita Deshmukh",
    role: "Soybean farmer, Vidarbha",
    initials: "SD",
  },
  {
    quote:
      "The weather alerts warned me before the rains came. I sprayed in time and my chilli crop came through clean this season.",
    name: "Gurpreet Singh",
    role: "Chilli farmer, Punjab",
    initials: "GS",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Farmer stories"
          title="Trusted in the field, season after season"
          description="Real farmers using CropWise AI to protect what they grow."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex flex-col rounded-3xl border border-forest-900/5 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-forest-900/10"
            >
              <Quote
                className="h-7 w-7 text-forest-200"
                aria-hidden="true"
              />
              <div
                className="mt-4 flex gap-1"
                role="img"
                aria-label="Rated 5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-forest-500 text-forest-500"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-forest-900/75">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-forest-900/5 pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800 text-sm font-semibold text-cream-50">
                  {testimonial.initials}
                </span>
                <div>
                  <p className="text-sm font-semibold text-forest-950">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-forest-900/50">
                    {testimonial.role}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
