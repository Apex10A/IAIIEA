import { SeminarPayments, RegistrationType, PaymentTier } from "./types";

export const getPaymentInfo = (payments: SeminarPayments, plan: string, attendanceType: 'virtual' | 'physical') => {
  // New structure - direct fee fields
  if (payments.physical_fee_naira !== undefined || payments.virtual_fee_naira !== undefined) {
    if (attendanceType === 'physical' && payments.physical_fee_naira !== undefined) {
      return {
        naira: payments.physical_fee_naira,
        usd: payments.physical_fee_usd || 0
      };
    }
    if (attendanceType === 'virtual' && payments.virtual_fee_naira !== undefined) {
      return {
        naira: payments.virtual_fee_naira,
        usd: payments.virtual_fee_usd || 0
      };
    }
  }
  
  // Legacy structure support
  if (payments[plan] && typeof payments[plan] === 'object' && 'virtual' in payments[plan]) {
    const planPayments = payments[plan] as RegistrationType;
    return planPayments[attendanceType];
  }
  
  // Check if it's the old structure with direct virtual/physical
  if (plan === 'basic' && payments.virtual && payments.physical) {
    return payments[attendanceType] as PaymentTier;
  }
  
  return null;
};

// Helper function to check if seminar has paid plans
export const hasPaidPlans = (payments: SeminarPayments) => {
  if (!payments) return false;
  
  // Check new structure
  const hasNewStructureFees = !!(
    (payments.physical_fee_naira && Number(payments.physical_fee_naira) > 0) ||
    (payments.physical_fee_usd && Number(payments.physical_fee_usd) > 0) ||
    (payments.virtual_fee_naira && Number(payments.virtual_fee_naira) > 0) ||
    (payments.virtual_fee_usd && Number(payments.virtual_fee_usd) > 0)
  );
  
  // Check legacy structure
  const hasLegacyPlans = !!(payments.basic || payments.standard || payments.premium);
  
  // Check direct virtual/physical structure (like your data)
  const hasDirectPayments = !!(
    (payments.virtual && (Number(payments.virtual.usd) > 0 || Number(payments.virtual.naira) > 0)) ||
    (payments.physical && (Number(payments.physical.usd) > 0 || Number(payments.physical.naira) > 0))
  );
  
  return hasNewStructureFees || hasLegacyPlans || hasDirectPayments;
};

// Helper function to validate image URLs
export const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return false;
  
  // Check if URL ends with just a slash (directory)
  if (trimmedUrl.endsWith('/')) return false;
  
  // Check if URL has a file extension
  const hasFileExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmedUrl);
  if (!hasFileExtension) return false;
  
  // Check if it's a proper URL
  try {
    new URL(trimmedUrl);
    return true;
  } catch {
    return false;
  }
};

// Placeholder image data URL (1x1 transparent pixel)
export const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";