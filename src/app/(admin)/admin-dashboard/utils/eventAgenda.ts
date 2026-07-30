/** UI hint for one schedule item per line using → between time and title. */
export const AGENDA_UI_PLACEHOLDER = `9:00–10:00 → Opening Prayer
10:00–11:00 → Keynote Speech
11:00–12:00 → Panel Discussion`;

const ARROW_TO_API = /\s*(?:→|➔|->)\s*/g;

/**
 * API format: comma-separated items, each "time -> title"
 * e.g. "9:00–10:00 -> Opening Prayer,10:00–11:00 -> Keynote Speech"
 */
export function agendaToApiFormat(uiAgenda: string): string {
  const lines = uiAgenda
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  return lines
    .map((line) => line.replace(ARROW_TO_API, " -> ").trim())
    .join(",");
}

/**
 * Converts API agenda (comma-separated or legacy multiline) to multiline UI with →.
 */
export function agendaFromApiFormat(apiAgenda: string): string {
  const raw = apiAgenda.trim();
  if (!raw) return "";

  if (/\r?\n/.test(raw)) {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/\s*->\s*/g, " → "))
      .join("\n");
  }

  const items = raw
    .split(/,(?=\s*\d{1,2}:\d{2})/)
    .map((item) => item.trim())
    .filter(Boolean);

  return items.map((item) => item.replace(/\s*->\s*/g, " → ")).join("\n");
}

export function formatAgendaForDisplay(apiAgenda: string): string {
  return agendaFromApiFormat(apiAgenda);
}
