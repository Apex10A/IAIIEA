import type { ConferencePayments, RegistrationType } from './types';

export type AttendanceType = 'virtual' | 'physical';

export interface ConferencePlanOption {
  key: string;
  title: string;
  description: string;
  isPopular?: boolean;
}

export const TIMING_PLANS: ConferencePlanOption[] = [
  {
    key: 'early_bird_registration',
    title: 'Early Bird',
    description: 'Lowest rate while early-bird registration is open.',
    isPopular: true,
  },
  {
    key: 'normal_registration',
    title: 'Normal',
    description: 'Standard rate during the main registration window.',
  },
  {
    key: 'late_registration',
    title: 'Late',
    description: 'Available after the regular registration period closes.',
  },
];

export const PACKAGE_PLANS: ConferencePlanOption[] = [
  {
    key: 'basic',
    title: 'Basic',
    description: 'Core conference access.',
  },
  {
    key: 'standard',
    title: 'Standard',
    description: 'Recommended package for most attendees.',
    isPopular: true,
  },
  {
    key: 'premium',
    title: 'Premium',
    description: 'Full access with additional benefits.',
  },
];

function parseAmount(value: string | number | undefined): number {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function hasPlanPricing(
  tier: RegistrationType | undefined,
  attendanceType: AttendanceType
): boolean {
  if (!tier) return false;
  const slot = tier[attendanceType];
  if (!slot) return false;
  return parseAmount(slot.usd) > 0 || parseAmount(slot.naira) > 0;
}

export function getVisibleConferencePlans(
  payments: ConferencePayments | undefined,
  attendanceType: AttendanceType
): { mode: 'timing' | 'package'; plans: ConferencePlanOption[] } | null {
  if (!payments) return null;

  const timingPlans = TIMING_PLANS.filter((plan) =>
    hasPlanPricing(payments[plan.key] as RegistrationType | undefined, attendanceType)
  );
  if (timingPlans.length > 0) {
    return { mode: 'timing', plans: timingPlans };
  }

  const packagePlans = PACKAGE_PLANS.filter((plan) =>
    hasPlanPricing(payments[plan.key] as RegistrationType | undefined, attendanceType)
  );
  if (packagePlans.length > 0) {
    return { mode: 'package', plans: packagePlans };
  }

  return null;
}

export function getPlanExplainer(mode: 'timing' | 'package'): string {
  if (mode === 'timing') {
    return 'Fees depend on when you register: early bird is the best rate, normal applies during the main window, and late registration opens afterward. Pick virtual or physical attendance, then choose the plan that matches your registration period.';
  }

  return 'Packages differ by level of access. Basic covers essentials, Standard suits most attendees, and Premium includes the fullest benefits. Switch between virtual and physical attendance to compare fees.';
}
