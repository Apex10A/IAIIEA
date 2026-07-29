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
