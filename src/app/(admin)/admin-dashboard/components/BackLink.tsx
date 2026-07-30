"use client";

import Link from "next/link";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BackLinkProps = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "text" | "button";
  className?: string;
};

export function BackLink({
  label,
  href,
  onClick,
  variant = "text",
  className,
}: BackLinkProps) {
  const isButton = variant === "button";
  const Icon = isButton ? ChevronLeft : ArrowLeft;

  const classes = cn(
    "inline-flex items-center gap-2 transition-colors",
    isButton
      ? "justify-center w-full md:w-auto rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
      : "text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      <Icon className={cn("shrink-0", isButton ? "h-5 w-5" : "h-4 w-4")} aria-hidden="true" />
      {label}
    </button>
  );
}
