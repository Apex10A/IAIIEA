"use client";
import { Button } from "@/components/ui/button";
import { SeminarDetails } from "../types";

interface PaymentModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  seminar: SeminarDetails | null;
  attendanceType: "virtual" | "physical";
  paymentProcessing: boolean;
}

export const PaymentModal = ({
  show,
  onClose,
  onConfirm,
  seminar,
  attendanceType,
  paymentProcessing,
}: PaymentModalProps) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-xl font-bold mb-4">Confirm Registration</h3>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Registration Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Seminar:</strong> {seminar?.title}</p>
              <p><strong>Attendance:</strong> {attendanceType === 'virtual' ? 'Virtual' : 'Physical'}</p>
              {(() => {
                const fee = attendanceType === 'virtual' 
                  ? { naira: seminar?.payments?.virtual_fee_naira || 0, usd: seminar?.payments?.virtual_fee_usd || 0 }
                  : { naira: seminar?.payments?.physical_fee_naira || 0, usd: seminar?.payments?.physical_fee_usd || 0 };
                
                return (
                  <p><strong>Fee:</strong> {
                    Number(fee.usd) > 0 || Number(fee.naira) > 0 
                      ? `$${fee.usd} / ₦${Number(fee.naira).toLocaleString()}`
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