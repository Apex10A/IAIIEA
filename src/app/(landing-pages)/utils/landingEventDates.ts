const DATE_RANGE_SPLIT = /\s+to\s+/i;

/** Split API date ranges like "March 15, 2025 To March 17, 2025" (case-insensitive). */
export function splitEventDateRange(dateString: string): { start: string; end?: string } {
  const trimmed = dateString?.trim() ?? '';
  if (!trimmed) return { start: '' };

  const parts = trimmed.split(DATE_RANGE_SPLIT).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { start: parts[0], end: parts.slice(1).join(' to ') };
  }

  return { start: trimmed };
}

function isPlaceholderYear(year: number): boolean {
  return year < 2018;
}

/** Parse a single date value safely (ISO, locale strings). Returns null when unreliable. */
export function parseEventDateValue(value: string): Date | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const isoValue = trimmed.includes('T') ? trimmed : `${trimmed}T12:00:00`;
    const parsed = new Date(isoValue);
    if (Number.isNaN(parsed.getTime()) || isPlaceholderYear(parsed.getFullYear())) {
      return null;
    }
    return parsed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime()) || isPlaceholderYear(parsed.getFullYear())) {
    return null;
  }

  return parsed;
}

const shortDateOptions: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

/** Format a landing event date range for cards and lists. Falls back to raw text when parsing fails. */
export function formatLandingEventDate(dateString: string): string {
  if (!dateString?.trim()) return '';

  const { start, end } = splitEventDateRange(dateString);
  const startDate = parseEventDateValue(start);
  const endDate = end ? parseEventDateValue(end) : null;

  if (startDate && endDate) {
    const startLabel = startDate.toLocaleDateString('en-US', shortDateOptions);
    const endLabel = endDate.toLocaleDateString('en-US', shortDateOptions);
    return `${startLabel} – ${endLabel}`;
  }

  if (startDate) {
    return startDate.toLocaleDateString('en-US', shortDateOptions);
  }

  if (endDate) {
    return endDate.toLocaleDateString('en-US', shortDateOptions);
  }

  return end ? `${start} to ${end}` : start || dateString;
}

export function parseEventDateForSort(dateString: string): number {
  const { start } = splitEventDateRange(dateString);
  return parseEventDateValue(start)?.getTime() ?? 0;
}

/** Build a Date for countdown timers from structured API fields. */
export function buildEventDateTime(startDate?: string | null, startTime?: string | null): Date | null {
  if (!startDate?.trim()) return null;

  const timeRaw = startTime?.trim() || '12:00:00';
  const normalizedTime = timeRaw.length === 5 ? `${timeRaw}:00` : timeRaw;
  const parsed = new Date(`${startDate.trim()}T${normalizedTime}`);

  if (Number.isNaN(parsed.getTime()) || isPlaceholderYear(parsed.getFullYear())) {
    return null;
  }

  return parsed;
}

/** Prefer structured start_date; otherwise format the combined date string. */
export function formatEventScheduleDisplay(options: {
  date?: string | null;
  startDate?: string | null;
  startTime?: string | null;
}): string {
  const { date, startDate, startTime } = options;

  if (date?.trim()) {
    const formatted = formatLandingEventDate(date);
    const { start, end } = splitEventDateRange(date);
    const parsedStart = parseEventDateValue(start);
    if (parsedStart || !end) {
      return formatted;
    }
  }

  const eventStart = buildEventDateTime(startDate, startTime);
  if (eventStart) {
    let label = eventStart.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    if (startTime?.trim()) {
      const timeOnly = buildEventDateTime('2000-01-01', startTime);
      if (timeOnly) {
        label += ` at ${timeOnly.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        })}`;
      }
    }

    return label;
  }

  return date?.trim() || '';
}
