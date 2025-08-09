export interface PaymentTier {
  usd: string | number;
  naira: string | number;
}

export interface RegistrationType {
  virtual?: PaymentTier;
  physical?: PaymentTier;
  package?: string[];
}

// Updated payment structure to match new backend
export interface SeminarPayments {
  physical_fee_naira?: number | string;
  physical_fee_usd?: number | string;
  virtual_fee_naira?: number | string;
  virtual_fee_usd?: number | string;
  // Legacy support for old structure (can be removed later)
  basic?: RegistrationType;
  standard?: RegistrationType;
  premium?: RegistrationType;
  virtual?: PaymentTier;  // For free seminars
  physical?: PaymentTier; // For free seminars
  [key: string]: RegistrationType | PaymentTier | number | string | undefined;
}

export interface Speaker {
  name: string | number;
  title: string | number;
  portfolio: string;
  picture: string;
}

export interface SeminarDetails {
  id: number;
  is_registered: boolean;
  current_plan?: string;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[] | null;
  work_shop: string[] | null;
  speakers: Speaker[];
  payments: SeminarPayments;
  status: string;
  resources: any[];
  is_free?: string;
  mode?: string;
}