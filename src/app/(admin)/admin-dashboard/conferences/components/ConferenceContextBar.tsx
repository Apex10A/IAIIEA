"use client";

import Link from "next/link";
import type { SortableConference } from "../utils/conferenceNav";

interface ConferenceContextBarProps {
  conferenceId: number | null;
  conferenceTitle?: string | null;
  conferences?: SortableConference[];
}

export function ConferenceContextBar({
  conferenceId,
  conferenceTitle,
  conferences = [],
}: ConferenceContextBarProps) {
  if (conferenceId === null) return null;

  const title =
    conferenceTitle?.trim() ||
    conferences.find((conference) => conference.id === conferenceId)?.title;

  if (!title) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-blue-100 bg-blue-50/80 px-4 py-3 text-sm text-gray-700 sm:flex-row sm:items-center sm:justify-between">
      <p>
        <span className="text-gray-500">Managing:</span>{" "}
        <span className="font-medium text-gray-900">{title}</span>
      </p>
      <Link
        href={`/admin-dashboard/conferences?id=${conferenceId}`}
        className="font-medium text-[#203a87] hover:underline shrink-0"
      >
        View conference
      </Link>
    </div>
  );
}
