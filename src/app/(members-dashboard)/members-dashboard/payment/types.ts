export interface PendingPayment {
  title: string;
  payment_id: string;
  amount: number;
  currency: string;
  sub_payments: Record<string, number> | [];
}