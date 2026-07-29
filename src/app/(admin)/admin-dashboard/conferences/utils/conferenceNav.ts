export type ConferenceSubPage =
  | "conference-schedule"
  | "participants"
  | "daily-meals";

export function conferenceSubPageHref(
  page: ConferenceSubPage,
  conferenceId?: number | string | null
): string {
  const base = `/admin-dashboard/conferences/${page}`;
  if (conferenceId != null && String(conferenceId).trim() !== "") {
    return `${base}?id=${conferenceId}`;
  }
  return base;
}

export function parseConferenceIdParam(id: string | null): number | null {
  if (!id) return null;
  const parsed = Number.parseInt(id, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function extractCreatedConferenceId(data: {
  data?: Record<string, unknown>;
}): number | null {
  const payload = data.data;
  if (!payload || typeof payload !== "object") return null;

  for (const key of ["id", "event_id", "conference_id"] as const) {
    const value = payload[key];
    if (typeof value === "number" && !Number.isNaN(value)) return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number.parseInt(value, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
  }

  return null;
}
