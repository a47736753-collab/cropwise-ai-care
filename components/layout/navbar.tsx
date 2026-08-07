"use client";

import { useState } from "react";
import { Leaf, Menu, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Stories" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-forest-900/5 bg-cream-50/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-800 text-cream-50 shadow-md shadow-forest-900/20">
            <Leaf className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-forest-950">
            CropWise AI
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-forest-900/70 transition-colors hover:text-forest-800"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/signup" size="sm">
            Get started
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-forest-900 transition-colors hover:bg-forest-800/10 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-forest-900/5 bg-cream-50 px-4 pb-6 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-forest-900/80 transition-colors hover:bg-forest-800/5"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            <ButtonLink
              href="/login"
              variant="secondary"
              size="md"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Sign in
            </ButtonLink>
            <ButtonLink
              href="/signup"
              size="md"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Get started
            </ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
