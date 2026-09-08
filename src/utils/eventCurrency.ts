export type EventCurrency = "NGN" | "USD";

const NIGERIA_TIMEZONES = new Set(["Africa/Lagos"]);

export function isNigeriaCountry(country?: string | null): boolean {
  if (!country?.trim()) return false;
  return country.trim().toLowerCase().includes("nigeria");
}

/** Guess currency for guests before profile is loaded. */
export function guessCurrencyFromTimezone(): EventCurrency {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (NIGERIA_TIMEZONES.has(tz)) return "NGN";
  } catch {
    // ignore
  }
  return "USD";
}

export function resolveEventCurrency(country?: string | null): EventCurrency {
  if (isNigeriaCountry(country)) return "NGN";
  if (country?.trim()) return "USD";
  return guessCurrencyFromTimezone();
}

function parseMoney(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatNairaAmount(value: string | number | null | undefined): string {
  const amount = parseMoney(value);
  return `₦${amount.toLocaleString()}`;
}

export function formatUsdAmount(value: string | number | null | undefined): string {
  const amount = parseMoney(value);
  return `$${amount.toLocaleString()}`;
}

export function formatEventPrice(
  currency: EventCurrency,
  usd: string | number | null | undefined,
  naira: string | number | null | undefined
): string {
  const nairaAmount = parseMoney(naira);
  const usdAmount = parseMoney(usd);

  if (currency === "NGN") {
    if (nairaAmount > 0) return formatNairaAmount(nairaAmount);
    if (usdAmount > 0) return formatUsdAmount(usdAmount);
    return "Free";
  }

  if (usdAmount > 0) return formatUsdAmount(usdAmount);
  if (nairaAmount > 0) return formatNairaAmount(nairaAmount);
  return "Free";
}

export function hasPaidEventPrice(
  usd: string | number | null | undefined,
  naira: string | number | null | undefined
): boolean {
  return parseMoney(usd) > 0 || parseMoney(naira) > 0;
}

export function inferPaymentAccessType(title: string): "conference" | "seminar" | "membership" | "other" {
  const normalized = title.toLowerCase();
  if (normalized.includes("conference")) return "conference";
  if (normalized.includes("seminar") || normalized.includes("webinar") || normalized.includes("training")) {
    return "seminar";
  }
  if (normalized.includes("membership") || normalized.includes("dues")) return "membership";
  return "other";
}
