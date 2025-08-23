"use client";
import { Button } from "@/components/ui/button";
import { SeminarDetails } from "../types";
import { getPaymentInfo, hasPaidPlans } from "../utils";

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  seminar: SeminarDetails | null;
  attendanceType: "virtual" | "physical";
  paymentProcessing: boolean;
  // Optional: selected plan for legacy tiers
  selectedPlan?: string;
}

export const PaymentModal = ({
  show,
  onClose,
  onConfirm,
  seminar,
  attendanceType,
  paymentProcessing,
  selectedPlan = "basic",
}: PaymentModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-2">Confirm Registration</h3>
        {seminar && (
          <div className="mb-4 text-sm">
            {seminar.is_free === 'free' ? (
              <div className="p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
                This seminar is free. On confirming, you will be registered immediately.
              </div>
            ) : (
              <div className="p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                This is a paid seminar. Confirming will <strong>initiate</strong> your registration only. To complete payment, go to your Dashboard → Payments and pay under <em>Pending Payments</em>.
              </div>
            )}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Seminar:</strong> {seminar?.title}</p>
              <p><strong>Attendance:</strong> {attendanceType === 'virtual' ? 'Virtual' : 'Physical'}</p>
              {(() => {
                // Use shared helper to correctly resolve fees across new/legacy structures
                const info = seminar?.payments
                  ? getPaymentInfo(seminar.payments, selectedPlan, attendanceType)
                  : null;
                const naira = info ? Number((info as any).naira || 0) : 0;
                const usd = info ? Number((info as any).usd || 0) : 0;
                return (
                  <p><strong>Fee:</strong> {
                    usd > 0 || naira > 0
                      ? `$${usd} / ₦${naira.toLocaleString()}`
                      : 'Free'
                  }</p>
                );
              })()}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={onClose}
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