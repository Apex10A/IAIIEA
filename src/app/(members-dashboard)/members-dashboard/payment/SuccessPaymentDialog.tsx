"use client";
import React from "react";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Button } from "@/components/ui/button";

export interface SuccessPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  formattedAmount: string;
}

const SuccessPaymentDialog: React.FC<SuccessPaymentDialogProps> = ({
  open,
  onOpenChange,
  title,
  formattedAmount,
}) => {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm" />
        <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
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
          <AlertDialog.Description className="text-gray-700 mb-6">
            You have successfully paid <span className="font-semibold">{formattedAmount}</span> for <span className="font-semibold">{title}</span>.
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Action asChild>
              <Button onClick={() => onOpenChange(false)}>Close</Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export default SuccessPaymentDialog;