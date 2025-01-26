export interface PaymentTier {
  virtual: {
    usd: string;
    naira: string;
  };
  physical: {
    usd: string;
    naira: string;
  };
  package: string[];
}

export interface PaymentsStructure {
  basic: PaymentTier;
  standard: PaymentTier;
  premium: PaymentTier;
}