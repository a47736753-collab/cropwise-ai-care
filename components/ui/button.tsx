import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-700 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest-800 text-cream-50 shadow-lg shadow-forest-900/20 hover:bg-forest-900 hover:shadow-forest-900/30 active:scale-[0.98]",
  secondary:
    "bg-white text-forest-900 ring-1 ring-forest-900/10 hover:ring-forest-900/25 hover:bg-cream-100 active:scale-[0.98]",
  outline:
    "text-forest-900 ring-1 ring-forest-900/20 hover:ring-forest-900/40 hover:bg-forest-800/5",
  ghost: "text-forest-900 hover:bg-forest-800/10",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & CommonProps;
type ButtonLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "children"
> &
  CommonProps & {
    href: string;
    children: ReactNode;
  };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
