"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-gray-200 bg-white px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-800",
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
        <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      {description ? (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}
