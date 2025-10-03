export interface PaymentTier {
  usd: string;
  naira: string;
}

export interface RegistrationType {
  virtual: PaymentTier;
  physical: PaymentTier;
  package?: any[];
}

export interface ConferencePayments {
  basic?: RegistrationType;
  standard?: RegistrationType;
  premium?: RegistrationType;
  early_bird_registration?: RegistrationType;
  normal_registration?: RegistrationType;
  late_registration?: RegistrationType;
  tour?: RegistrationType;
  annual_dues?: RegistrationType;
  vetting_fee?: RegistrationType;
  publication_fee?: RegistrationType;
  [key: string]: any;
}

export interface Speaker {
  name: string;
  title: string;
  portfolio: string;
  picture: string;
}

export interface Sponsor {
  name: string;
  logo: string;
  website?: string;
}

export interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  current_plan?: string;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  flyer: string;
  gallery: string[];
  sponsors: Sponsor[];
  videos: string[];
  payments: ConferencePayments;
  status: string;
  resources: any[];
  schedule: any[];
  meals: any[];
  speakers: Speaker[];
}