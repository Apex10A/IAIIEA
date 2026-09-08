"use client";

import Link from "next/link";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";
import { MEMBERS_DASHBOARD_URL } from "@/app/(landing-pages)/utils/dashboardLinks";

export type PaymentAccessType = "conference" | "seminar" | "membership" | "other";

export interface SuccessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formattedAmount: string;
  accessType?: PaymentAccessType;
}

const accessCopy: Record<
  PaymentAccessType,
  { headline: string; detail: string; cta?: { label: string; href: string } }
> = {
  conference: {
    headline: "You're registered for the conference",
    detail:
      "Payment confirmed. You now have access to conference materials, announcements, and the participant portal in your dashboard.",
    cta: { label: "Open dashboard", href: MEMBERS_DASHBOARD_URL },
  },
  seminar: {
    headline: "You're registered for the seminar",
    detail:
      "Payment confirmed. Seminar resources and updates are now available from your dashboard.",
    cta: { label: "Open dashboard", href: MEMBERS_DASHBOARD_URL },
  },
  membership: {
    headline: "Membership payment received",
    detail: "Your membership status has been updated. Explore member resources from your dashboard.",
    cta: { label: "Open dashboard", href: MEMBERS_DASHBOARD_URL },
  },
  other: {
    headline: "Payment successful",
    detail: "Your payment was received. You can review your account from the dashboard.",
    cta: { label: "Open dashboard", href: MEMBERS_DASHBOARD_URL },
  },
};

const SuccessPaymentDialog: React.FC<SuccessPaymentDialogProps> = ({
  open,
  onOpenChange,
  title,
  formattedAmount,
  accessType = "other",
}) => {
  const copy = accessCopy[accessType];

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm z-50" />
        <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[480px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-green-100 text-green-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <AlertDialog.Title className="text-lg font-semibold text-gray-900">
              Payment Successful
            </AlertDialog.Title>
          </div>

          <AlertDialog.Description asChild>
            <div className="space-y-4 text-gray-700 mb-6">
              <p>
                You paid <span className="font-semibold">{formattedAmount}</span> for{" "}
                <span className="font-semibold">{title}</span>.
              </p>
              <div className="rounded-lg bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-900">
                <p className="font-semibold mb-1">{copy.headline}</p>
                <p>{copy.detail}</p>
              </div>
            </div>
          </AlertDialog.Description>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <AlertDialog.Action asChild>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Stay here
              </Button>
            </AlertDialog.Action>
            {copy.cta && (
              <Button asChild className="bg-[#203a87] text-white hover:bg-[#1a2f6d]">
                <Link href={copy.cta.href}>{copy.cta.label}</Link>
              </Button>
            )}
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default SuccessPaymentDialog;
