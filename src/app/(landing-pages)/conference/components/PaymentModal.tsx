"use client";
import { Button } from "@/components/ui/button";
import { ConferenceDetails } from "../page";

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  conference: ConferenceDetails | null;
  attendanceType: "virtual" | "physical";
  paymentProcessing: boolean;
  selectedPlan: string;
}

export const PaymentModal = ({
  show,
  onClose,
  onConfirm,
  conference,
  attendanceType,
  paymentProcessing,
  selectedPlan,
}: PaymentModalProps) => {
  if (!show) return null;

  // Helper function to get payment info for the selected plan
  const getPaymentInfo = (plan: string) => {
    if (!conference?.payments || !plan) return { usd: "0", naira: "0" };

    const planData = conference.payments[plan as keyof typeof conference.payments];
    if (!planData || typeof planData !== 'object') return { usd: "0", naira: "0" };

    const typeData = (planData as any)[attendanceType];
    return {
      usd: typeData?.usd || "0",
      naira: typeData?.naira || "0"
    };
  };

  const paymentInfo = getPaymentInfo(selectedPlan);

  // Helper to format plan name
  const formatPlanName = (plan: string) => {
    return plan
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-2">Confirm Registration</h3>
        <div className="mb-4 text-sm">
          <div className="p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            This is a paid conference. Confirming will <strong>initiate</strong> your registration only. To complete payment, go to your Dashboard → Payments and pay under <em>Pending Payments</em>.
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Conference:</strong> {conference?.title}</p>
              <p><strong>Plan:</strong> {formatPlanName(selectedPlan)}</p>
              <p><strong>Attendance:</strong> {attendanceType === 'virtual' ? 'Virtual' : 'Physical'}</p>
              <p><strong>Fee:</strong> ${paymentInfo.usd} / ₦{Number(paymentInfo.naira).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-white hover:bg-gray-200"
              disabled={paymentProcessing}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
              onClick={onConfirm}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? "Processing..." : "Confirm Registration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};