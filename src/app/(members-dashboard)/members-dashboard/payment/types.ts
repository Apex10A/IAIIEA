export interface PendingPayment {
  title: string;
  payment_id: string;
  amount: number;
  currency: string;
  sub_payments: Record<string, number> | [];
  /** Event id from API (conference or seminar), when provided */
  id?: number;
  event_id?: number;
  conference_id?: number;
  seminar_id?: number;
  plan?: string;
  type?: string;
  mode?: string;
  attendance_type?: string;
}