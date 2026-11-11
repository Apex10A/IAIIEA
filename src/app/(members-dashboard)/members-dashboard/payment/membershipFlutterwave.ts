import type { FlutterwaveConfig } from "flutterwave-react-v3/dist/types";
import type { PendingPayment } from "./types";

type SessionLike = {
  user?: {
    email?: string | null;
    userData?: {
      email?: string;
      name?: string;
      phone?: string;
    };
  };
};

export function buildMembershipFlutterwaveConfig(
  payment: PendingPayment,
  amount: number,
  session: SessionLike
): FlutterwaveConfig | null {
  const publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY?.trim();
  if (!publicKey) return null;

  const userData = session.user?.userData;
  const email = userData?.email || session.user?.email || "";
  const name = userData?.name || "Member";

  return {
    public_key: publicKey,
    tx_ref: `${payment.payment_id}-${Date.now()}`,
    amount,
    currency: payment.currency || "USD",
    customer: {
      email,
      name,
      phone_number: userData?.phone || "0000000000",
    },
    customizations: {
      title: payment.title || "IAIIEA Membership",
      description: `IAIIEA ${payment.title} payment`,
      logo: "/IAIIEA Logo.png",
    },
    payment_options: "card,banktransfer,ussd",
  };
}
