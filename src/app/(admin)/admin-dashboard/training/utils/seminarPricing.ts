export const SEMINAR_PRICING_TYPES = {
  FREE: "free",
  PAID: "paid",
  MEMBER_FREE: "memberfree",
} as const;

export type SeminarPricingType =
  (typeof SEMINAR_PRICING_TYPES)[keyof typeof SEMINAR_PRICING_TYPES];

export const SEMINAR_TYPE_OPTIONS: {
  value: SeminarPricingType;
  label: string;
  description: string;
}[] = [
  {
    value: SEMINAR_PRICING_TYPES.FREE,
    label: "Free (Everyone)",
    description: "Open to everyone at no cost. No fees required.",
  },
  {
    value: SEMINAR_PRICING_TYPES.PAID,
    label: "Paid",
    description: "All attendees pay the standard fees set in step 2.",
  },
  {
    value: SEMINAR_PRICING_TYPES.MEMBER_FREE,
    label: "Free for Members",
    description:
      "Members register free. Non-members (e.g. conference participants) pay the fees set in step 2.",
  },
];

export function isPaidSeminar(isFree: string): boolean {
  return isFree === SEMINAR_PRICING_TYPES.PAID;
}

export function isFreeSeminar(isFree: string): boolean {
  return isFree === SEMINAR_PRICING_TYPES.FREE;
}

export function isMemberFreeSeminar(isFree: string): boolean {
  return isFree === SEMINAR_PRICING_TYPES.MEMBER_FREE;
}

export function requiresSeminarFees(isFree: string): boolean {
  return isPaidSeminar(isFree) || isMemberFreeSeminar(isFree);
}

export function getSeminarTypeLabel(isFree: string): string {
  const option = SEMINAR_TYPE_OPTIONS.find((item) => item.value === isFree);
  return option?.label ?? (isFree || "Unknown");
}

export interface SeminarFeeFields {
  physical_fee_naira: number | string;
  physical_fee_usd: number | string;
  virtual_fee_naira: number | string;
  virtual_fee_usd: number | string;
}

export function parseFeeValue(value: number | string): number {
  if (value === "" || value === null || value === undefined) return 0;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function validateSeminarFees(
  isFree: string,
  mode: string,
  fees: SeminarFeeFields
): string | null {
  if (!requiresSeminarFees(isFree)) return null;

  const needsPhysical = mode === "Physical" || mode === "Virtual_Physical";
  const needsVirtual = mode === "Virtual" || mode === "Virtual_Physical";

  if (needsPhysical) {
    const naira = parseFeeValue(fees.physical_fee_naira);
    const usd = parseFeeValue(fees.physical_fee_usd);
    if (naira <= 0 && usd <= 0) {
      return "Enter at least one physical fee (Naira or USD) for paid seminars.";
    }
  }

  if (needsVirtual) {
    const naira = parseFeeValue(fees.virtual_fee_naira);
    const usd = parseFeeValue(fees.virtual_fee_usd);
    if (naira <= 0 && usd <= 0) {
      return "Enter at least one virtual fee (Naira or USD) for paid seminars.";
    }
  }

  return null;
}

export function feesForSubmission(
  isFree: string,
  fees: SeminarFeeFields
): SeminarFeeFields {
  if (isFreeSeminar(isFree)) {
    return {
      physical_fee_naira: 0,
      physical_fee_usd: 0,
      virtual_fee_naira: 0,
      virtual_fee_usd: 0,
    };
  }

  return {
    physical_fee_naira: parseFeeValue(fees.physical_fee_naira),
    physical_fee_usd: parseFeeValue(fees.physical_fee_usd),
    virtual_fee_naira: parseFeeValue(fees.virtual_fee_naira),
    virtual_fee_usd: parseFeeValue(fees.virtual_fee_usd),
  };
}

export function getSeminarModeLabel(mode: string): string {
  switch (mode) {
    case "Physical":
      return "Physical Only";
    case "Virtual":
      return "Virtual Only";
    case "Virtual_Physical":
      return "Hybrid (Virtual & Physical)";
    default:
      return mode || "Not set";
  }
}
