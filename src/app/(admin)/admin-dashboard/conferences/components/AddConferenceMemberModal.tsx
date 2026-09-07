"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/utils/toast";

const PLAN_OPTIONS = [
  { value: "complimentary", label: "Complimentary (no payment)" },
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
] as const;

type PlanValue = (typeof PLAN_OPTIONS)[number]["value"];

interface AddConferenceMemberModalProps {
  conferenceId: number;
  conferenceTitle: string;
  onMemberAdded: () => void;
}

export function AddConferenceMemberModal({
  conferenceId,
  conferenceTitle,
  onMemberAdded,
}: AddConferenceMemberModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState<PlanValue>("complimentary");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const resetForm = () => {
    setEmail("");
    setPlan("complimentary");
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      showToast.error("Please enter the member's email address");
      return;
    }

    if (!bearerToken) {
      showToast.error("You must be signed in to add members");
      return;
    }

    setIsLoading(true);
    try {
      const body: { id: string; email: string; plan?: string } = {
        id: String(conferenceId),
        email: trimmedEmail,
      };

      if (plan !== "complimentary") {
        body.plan = plan;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add_conference_member`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to add member to conference");
      }

      showToast.success("Member added to conference successfully");
      resetForm();
      setIsOpen(false);
      onMemberAdded();
    } catch (error) {
      console.error("Error adding conference member:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to add member"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <Dialog.Trigger asChild>
        <Button size="sm" className="gap-2 bg-[#203a87] text-white hover:bg-[#1a2f6d]">
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[90vh] w-[90vw] max-w-[480px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-xl focus:outline-none z-50">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-gray-800">
              Add Member
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="rounded-sm opacity-70 hover:opacity-100" aria-label="Close">
                <Cross2Icon className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Register an existing platform member for{" "}
            <span className="font-medium text-gray-900">{conferenceTitle}</span>{" "}
            without requiring payment.
          </p>

          <div className="rounded-md bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-800 mb-5">
            The member must already have an account on IAIIEA. They will appear in
            the participant list immediately — no checkout needed.
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">Member email</Label>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-plan">Plan label</Label>
              <Select value={plan} onValueChange={(value) => setPlan(value as PlanValue)}>
                <SelectTrigger id="member-plan">
                  <SelectValue placeholder="Select plan" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Cosmetic label only — complimentary skips payment entirely.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gap-2 bg-[#203a87] text-white hover:bg-[#1a2f6d]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Add to conference
                </>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
