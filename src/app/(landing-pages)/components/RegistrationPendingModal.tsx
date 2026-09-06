"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CreditCard } from "lucide-react";
import { MEMBERS_PAYMENTS_URL } from "../utils/dashboardLinks";

interface RegistrationPendingModalProps {
  show: boolean;
  onClose: () => void;
  eventTitle: string;
  planLabel?: string;
  attendanceType?: "virtual" | "physical";
}

export function RegistrationPendingModal({
  show,
  onClose,
  eventTitle,
  planLabel,
  attendanceType,
}: RegistrationPendingModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600 shrink-0" />
          <h3 className="text-xl font-bold text-[#0E1A3D]">Registration started</h3>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          Your registration for <strong>{eventTitle}</strong> has been added.
          Payment is not complete yet — finish it from your dashboard.
        </p>

        {(planLabel || attendanceType) && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 mb-4 space-y-1">
            {planLabel && (
              <p>
                <strong>Plan:</strong> {planLabel}
              </p>
            )}
            {attendanceType && (
              <p>
                <strong>Attendance:</strong>{" "}
                {attendanceType === "virtual" ? "Virtual" : "Physical"}
              </p>
            )}
          </div>
        )}

        <div className="p-3 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-sm mb-6">
          Open <strong>Dashboard → Payment</strong> and pay under{" "}
          <em>Pending Payments</em> to complete your registration.
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="bg-white hover:bg-gray-100">
            Stay on this page
          </Button>
          <Button
            asChild
            className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
          >
            <Link href={MEMBERS_PAYMENTS_URL}>
              <CreditCard className="w-4 h-4 mr-2" />
              Go to Payments
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
