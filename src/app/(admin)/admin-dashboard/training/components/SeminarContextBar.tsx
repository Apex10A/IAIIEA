"use client";

import Link from "next/link";
import type { SortableSeminar } from "../utils/seminarNav";

interface SeminarContextBarProps {
  seminarId: number | null;
  seminarTitle?: string | null;
  seminars?: SortableSeminar[];
}

export function SeminarContextBar({
  seminarId,
  seminarTitle,
  seminars = [],
}: SeminarContextBarProps) {
  if (seminarId === null) return null;

  const title =
    seminarTitle?.trim() ||
    seminars.find((seminar) => seminar.id === seminarId)?.title;

  if (!title) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-gray-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-gray-200 sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="text-gray-500 dark:text-gray-400">Managing:</span>{" "}
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
      </p>
      <Link
        href={`/admin-dashboard/training?id=${seminarId}`}
        className="font-medium text-[#203a87] hover:underline shrink-0 dark:text-blue-300"
      >
        View seminar
      </Link>
    </div>
  );
}
