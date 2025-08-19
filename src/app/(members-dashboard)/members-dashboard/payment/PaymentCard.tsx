"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PendingPayment } from "./types";

export interface PaymentCardProps {
  payment: PendingPayment;
  isProcessing: boolean;
  selectedPlan?: string;
  onPlanChange?: (plan: string) => void;
  onMakePayment: () => void;
  onCancelClick: () => void;
  formatAmount: (amount: number, currency: string) => string;
  // If false, hide the cancel button (e.g., for membership payments)
  canCancel?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  isProcessing,
  selectedPlan,
  onPlanChange,
  onMakePayment,
  onCancelClick,
  formatAmount,
  canCancel,
}) => {
  const hasSubPayments =
    payment.sub_payments &&
    typeof payment.sub_payments === "object" &&
    Object.keys(payment.sub_payments).length > 0;

  return (
    <Card className="mb-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{payment?.title}</h3>
              <Badge variant="outline" className="text-xs">
                {payment?.currency}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-primary">
              {hasSubPayments && selectedPlan
                ? formatAmount(
                    (payment?.sub_payments as Record<string, number>)[selectedPlan],
                    payment.currency
                  )
                : formatAmount(payment?.amount, payment.currency)}
            </p>
            <p className="text-sm text-gray-500">Payment ID: {payment.payment_id}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {hasSubPayments && (
              <Select
                onValueChange={(value: string) => onPlanChange?.(value)}
                defaultValue={Object.keys(payment?.sub_payments)[0]}
                value={selectedPlan}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(payment?.sub_payments).map(([planName, planAmount]) => (
                    <SelectItem key={planName} value={planName}>
                      {planName} ({formatAmount(planAmount, payment?.currency)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Button onClick={onMakePayment} disabled={isProcessing} className="w-full sm:w-auto bg-[#D5B93C] text-[#0E1A3D] hover:bg-[#D5B93C]/90">
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Make Payment"
              )}
            </Button>
            {(canCancel !== false) && (
              <Button variant="destructive" onClick={onCancelClick} className="w-full sm:w-auto">
                Cancel Payment
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentCard;