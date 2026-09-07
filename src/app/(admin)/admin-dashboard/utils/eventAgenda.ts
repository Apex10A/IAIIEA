/** UI hint for one schedule item per line. Admins can use either format. */
export const AGENDA_UI_PLACEHOLDER = `9am - 10am Opening Prayer
10 - 12 Remote Sessions
12 - 2pm Keynote Speakers

(or use arrows: 9:00–10:00 → Opening Prayer)`;

export interface AgendaItem {
  time: string;
  title: string;
}

/** One editable row in the admin schedule builder. */
export interface AgendaScheduleRow {
  startTime: string;
  endTime: string;
  title: string;
}

const ARROW_TO_API = /\s*(?:→|➔|->)\s*/g;
const ARROW_SPLIT = /\s*(?:→|➔|->)\s*/;
const RANGE_DASH = /\s[-–—]\s/;

/** Comma before the next schedule item (starts with a time-like token). */
const COMMA_BEFORE_NEXT_ITEM =
  /,(?=\s*\d{1,2}(?:\s*(?:am|pm|AM|PM)|(?::\d{2})|\s*[-–—]))/;

function hasLetters(text: string): boolean {
  return /[A-Za-z]/.test(text);
}

function normalizeWhitespace(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

function formatTimeRange(start: string, end: string): string {
  return `${normalizeWhitespace(start)} – ${normalizeWhitespace(end)}`;
}

/**
 * After "start - ", the remainder is "end time + title".
 * e.g. "10 am Opening prayer" → end "10 am", title "Opening prayer"
 */
function splitEndTimeFromTitle(text: string): { end: string; title: string } | null {
  const trimmed = normalizeWhitespace(text);

  const patterns: RegExp[] = [
    /^(\d{1,2}:\d{2}\s*(?:am|pm)?)\s+(.+)$/i,
    /^(\d{1,2}\s+(?:am|pm))\s+(.+)$/i,
    /^(\d{1,2}(?:am|pm))\s+(.+)$/i,
    /^(\d{1,2})\s+([A-Za-z].+)$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && hasLetters(match[2])) {
      return { end: match[1].trim(), title: match[2].trim() };
    }
  }

  return null;
}

function parseTimeRangeLine(line: string): AgendaItem | null {
  if (!RANGE_DASH.test(line)) return null;

  const [start, ...restParts] = line.split(RANGE_DASH);
  if (!start?.trim() || restParts.length === 0) return null;

  const afterDash = restParts.join(" - ").trim();
  const endAndTitle = splitEndTimeFromTitle(afterDash);

  if (endAndTitle) {
    return {
      time: formatTimeRange(start, endAndTitle.end),
      title: endAndTitle.title,
    };
  }

  return {
    time: formatTimeRange(start, afterDash),
    title: "",
  };
}

function parseArrowLine(line: string): AgendaItem | null {
  const normalized = line.replace(/\s*->\s*/g, " → ").trim();
  const parts = normalized.split(ARROW_SPLIT).map((part) => part.trim());

  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { time: parts[0], title: parts.slice(1).join(" → ") };
  }

  return null;
}

function parseAgendaLine(line: string): AgendaItem {
  const trimmed = line.trim();
  if (!trimmed) return { time: "", title: "" };

  const arrowItem = parseArrowLine(trimmed);
  if (arrowItem) return arrowItem;

  const rangeItem = parseTimeRangeLine(trimmed);
  if (rangeItem && rangeItem.title) return rangeItem;

  const singleTime = trimmed.match(/^(\d{1,2}(?::\d{2})?(?:\s*(?:am|pm))?)\s+(.+)$/i);
  if (singleTime && hasLetters(singleTime[2])) {
    return { time: singleTime[1].trim(), title: singleTime[2].trim() };
  }

  if (rangeItem) return rangeItem;

  return { time: "", title: trimmed };
}

function splitAgendaLines(raw: string): string[] {
  if (/\r?\n/.test(raw)) {
    return raw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  return raw
    .split(COMMA_BEFORE_NEXT_ITEM)
    .map((item) => item.trim())
    .filter(Boolean);
}

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

  return splitAgendaLines(raw)
    .map((line) => {
      const item = parseAgendaLine(line);
      if (item.time && item.title) return `${item.time} → ${item.title}`;
      return item.title || item.time;
    })
    .join("\n");
}

export function formatAgendaForDisplay(apiAgenda: string): string {
  return agendaFromApiFormat(apiAgenda);
}

/** Structured agenda rows for schedule-style UI. Tolerates free-form admin input. */
export function parseAgendaItems(apiAgenda: string): AgendaItem[] {
  const raw = apiAgenda.trim();
  if (!raw) return [];

  return splitAgendaLines(raw)
    .map(parseAgendaLine)
    .filter((item) => item.time || item.title);
}

export function splitAgendaTimeRange(time: string): {
  startTime: string;
  endTime: string;
} {
  const normalized = time.trim();
  const match = normalized.match(/^(.+?)\s[–—-]\s(.+)$/);
  if (match) {
    return { startTime: match[1].trim(), endTime: match[2].trim() };
  }
  return { startTime: normalized, endTime: "" };
}

/** Parse stored API agenda into admin editor rows. */
export function parseAgendaToRows(apiAgenda: string): AgendaScheduleRow[] {
  const items = parseAgendaItems(apiAgenda);
  if (items.length === 0) return [emptyAgendaRow()];

  return items.map((item) => {
    const { startTime, endTime } = splitAgendaTimeRange(item.time);
    return { startTime, endTime, title: item.title };
  });
}

export function emptyAgendaRow(): AgendaScheduleRow {
  return { startTime: "", endTime: "", title: "" };
}

/** Serialize admin rows to the comma-separated API format. */
export function agendaRowsToApiFormat(rows: AgendaScheduleRow[]): string {
  return rows
    .map((row) => {
      const start = row.startTime.trim();
      const end = row.endTime.trim();
      const title = row.title.trim();
      if (!title) return "";
      if (start && end) return `${start} - ${end} ${title}`;
      if (start) return `${start} ${title}`;
      return title;
    })
    .filter(Boolean)
    .join(",");
}
