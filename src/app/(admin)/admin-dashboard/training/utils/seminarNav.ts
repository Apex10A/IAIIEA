export type SeminarSubPage = "participants";

export function seminarSubPageHref(
  page: SeminarSubPage,
  seminarId?: number | string | null
): string {
  const base = `/admin-dashboard/training/${page}`;
  if (seminarId != null && String(seminarId).trim() !== "") {
    return `${base}?id=${seminarId}`;
  }
  return base;
}

export function seminarDetailHref(
  seminarId: number,
  view: "details" | "resources" = "details"
): string {
  const params = new URLSearchParams();
  params.set("id", String(seminarId));
  if (view === "resources") {
    params.set("view", "resources");
  }
  return `/admin-dashboard/training?${params.toString()}`;
}

export interface SortableSeminar {
  id: number;
  title: string;
  date?: string;
  status?: string;
}

export function sortSeminars<T extends SortableSeminar>(seminars: T[]): T[] {
  return [...seminars].sort((a, b) => {
    if (a.status !== "Completed" && b.status === "Completed") return -1;
    if (a.status === "Completed" && b.status !== "Completed") return 1;

    const yearA = Number.parseInt(
      a.title.match(/\d{4}/)?.[0] || a.date?.match(/\d{4}/)?.[0] || "0",
      10
    );
    const yearB = Number.parseInt(
      b.title.match(/\d{4}/)?.[0] || b.date?.match(/\d{4}/)?.[0] || "0",
      10
    );

    if (yearB !== yearA) return yearB - yearA;
    return b.id - a.id;
  });
}

export function parseSeminarIdParam(id: string | null): number | null {
  if (!id) return null;
  const parsed = Number.parseInt(id, 10);
  return Number.isNaN(parsed) ? null : parsed;
}
