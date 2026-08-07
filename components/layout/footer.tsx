import { Leaf, Mail, MapPin, Phone } from "lucide-react";

const productLinks = [
  { label: "AI leaf diagnosis", href: "#features" },
  { label: "Disease library", href: "#features" },
  { label: "Treatment plans", href: "#how-it-works" },
  { label: "Agri chatbot", href: "#features" },
];

const companyLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Farmer stories", href: "#testimonials" },
  { label: "Languages", href: "#get-started" },
];

export function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-100">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1.25fr]">
          {/* Brand */}
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-50 text-forest-800">
                <Leaf className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-serif text-lg font-semibold tracking-tight">
                CropWise AI
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-100/60">
              AI crop disease detection for farmers. Photograph a leaf, know the
              disease in seconds — in your own language.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cream-100/50">
              Product
            </h3>
            <ul className="mt-4 space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-cream-100/75 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cream-100/50">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-cream-100/75 transition-colors hover:text-cream-50"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cream-100/50">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-cream-100/75">
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-leaf-300" aria-hidden="true" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-leaf-300" aria-hidden="true" />
                hello@cropwise.ai
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-leaf-300" aria-hidden="true" />
                Serving farmers across India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-100/10 pt-8 sm:flex-row">
          <p className="text-sm text-cream-100/50">
            © {new Date().getFullYear()} CropWise AI. All rights reserved.
          </p>
          <p className="text-sm text-cream-100/50">
            English · हिन्दी · मराठी
          </p>
        </div>
      </div>
    </footer>
  );
}
