"use client"
import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/utils/toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PaymentCard from './PaymentCard';
import LoadingSkeleton from './LoadingSkeleton';
import CancelPaymentDialog from './CancelPaymentDialog';
import SuccessPaymentDialog from './SuccessPaymentDialog';
import type { PendingPayment } from './types';
import { inferPaymentAccessType } from '@/utils/eventCurrency';
import {
  buildPendingPaymentInitiateRequest,
  confirmPaymentWithId,
  enrichPendingPaymentForInitiate,
  getPaymentCallbackUrl,
  getPaymentIdFromReturnSearchParams,
  getPaymentLinkFromInitiateResponse,
} from '@/utils/paymentFlow';

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({});
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  const [canceledPaymentId, setCanceledPaymentId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [confirmingReturn, setConfirmingReturn] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    title: string;
    formattedAmount: string;
    accessType: ReturnType<typeof inferPaymentAccessType>;
  } | null>(null);

  const confirmedReturnRef = useRef<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchPendingPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/pending_payments/`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        showToast.error('Your session expired. Sign in again to confirm your payment status.');
        setLoading(false);
        return;
      }

      const responseData = await response.json();

      if (responseData.status === "success" && Array.isArray(responseData.data)) {
        setPendingPayments(responseData.data.map(normalizePendingPayment));
      } else if (responseData.payments) {
        setPendingPayments(responseData.payments.map(normalizePendingPayment));
      } else {
        setPendingPayments([]);
        console.error('Unexpected API response structure:', responseData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending payments:', error);
      showToast.error('Failed to fetch pending payments');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchPendingPayments();
    } else {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    const initialPlans: Record<string, string> = {};
    pendingPayments.forEach(payment => {
      if (payment.sub_payments &&
          typeof payment.sub_payments === 'object' &&
          Object.keys(payment.sub_payments).length > 0) {
        initialPlans[payment.payment_id] = Object.keys(payment.sub_payments)[0];
      }
    });
    setSelectedPlans(prev => ({...prev, ...initialPlans}));
  }, [pendingPayments]);

  useEffect(() => {
    const paymentId = getPaymentIdFromReturnSearchParams(searchParams);
    if (!paymentId || !bearerToken) return;
    if (confirmedReturnRef.current === paymentId) return;

    confirmedReturnRef.current = paymentId;

    const completeReturnPayment = async () => {
      setConfirmingReturn(true);
      let confirmed = false;
      try {
        const result = await confirmPaymentWithId(paymentId, bearerToken);

        if (result.status === 'success') {
          confirmed = true;
          const matched = pendingPayments.find((p) => p.payment_id === paymentId);
          setSuccessInfo({
            title: matched?.title || 'Payment',
            formattedAmount: matched
              ? formatAmount(matched.amount, matched.currency)
              : '',
            accessType: inferPaymentAccessType(matched?.title || ''),
          });
          setShowSuccessDialog(true);
          showToast.success('Payment confirmed successfully');
          await fetchPendingPayments();
        } else {
          confirmedReturnRef.current = null;
          showToast.error(result.message || 'Payment confirmation failed');
        }
      } catch (error) {
        confirmedReturnRef.current = null;
        console.error('Payment return confirmation error:', error);
        showToast.error('Payment confirmation failed');
      } finally {
        setConfirmingReturn(false);
        if (confirmed) {
          router.replace('/members-dashboard?tab=payment');
        }
      }
    };

    completeReturnPayment();
  }, [searchParams, bearerToken, router]);

  const initiatePayment = async (payment: PendingPayment) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setProcessingStates(prev => ({ ...prev, [payment.payment_id]: true }));

    try {
      let selectedPlan = selectedPlans[payment.payment_id] || '';
      if (
        payment.sub_payments &&
        typeof payment.sub_payments === 'object' &&
        Object.keys(payment.sub_payments).length > 0 &&
        !selectedPlan
      ) {
        selectedPlan = Object.keys(payment.sub_payments)[0];
      }

      const enrichedPayment = bearerToken
        ? await enrichPendingPaymentForInitiate(payment, bearerToken)
        : payment;

      const { path, body } = buildPendingPaymentInitiateRequest(
        enrichedPayment,
        selectedPlan,
        getPaymentCallbackUrl()
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${path}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        }
      );

      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result?.message || 'Payment initiation failed');
      }

      const paymentLink = getPaymentLinkFromInitiateResponse(result);
      if (!paymentLink) {
        throw new Error('No payment link returned from server');
      }

      window.location.href = paymentLink;
    } catch (error) {
      console.error('Payment initiation error:', error);
      showToast.error(
        error instanceof Error ? error.message : 'Payment initiation failed'
      );
      setProcessingStates(prev => ({ ...prev, [payment.payment_id]: false }));
    }
  };

  const handleCancelConfirm = async () => {
    if (!canceledPaymentId) return;
    setShowCancelDialog(false);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cancel_payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ payment_id: canceledPaymentId }),
      });

      if (response.status === 401 || response.status === 403) {
        showToast.error('Session expired. Sign in again to manage payments.');
        return;
      }

      const result = await response.json();

      if (result.status === 'success') {
        showToast.success('Payment canceled successfully');
        await fetchPendingPayments();
      } else {
        showToast.error(result.message || 'Failed to cancel payment');
      }
    } catch (error) {
      showToast.error('Failed to cancel payment');
    } finally {
      setCanceledPaymentId(null);
    }
  };

  const handleCancelDismiss = () => {
    setShowCancelDialog(false);
    setCanceledPaymentId(null);
  };

  const formatAmount = (amount: number, currency: string) => {
    return currency === 'USD'
      ? `$${amount.toLocaleString()}`
      : `${currency} ${amount.toLocaleString()}`;
  };

  if (status === "loading" || loading || confirmingReturn) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-3">
          <div className="h-8 bg-gray-100 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-100 rounded w-64 animate-pulse"></div>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Pending Payments</h1>
        <p className="text-gray-600 mt-2">Complete your outstanding payments</p>
      </div>

      {pendingPayments.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900">No pending payments</h3>
          <p className="text-gray-500 mt-1">You're all caught up with your payments</p>
        </div>
      ) : (
        <>
          <Alert className="mb-6">
            <AlertTitle className="flex items-center gap-2">Pending Payments</AlertTitle>
            <AlertDescription>
              You have {pendingPayments?.length} pending payment{pendingPayments?.length > 1 ? 's' : ''} to complete.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {pendingPayments?.map((payment) => {
              const isMembership = payment?.title?.toLowerCase?.().includes('membership');
              return (
                <PaymentCard
                  key={payment?.payment_id}
                  payment={payment}
                  isProcessing={!!processingStates[payment.payment_id]}
                  selectedPlan={selectedPlans[payment.payment_id]}
                  onPlanChange={(value) => setSelectedPlans(prev => ({ ...prev, [payment.payment_id]: value }))}
                  onMakePayment={() => initiatePayment(payment)}
                  onCancelClick={() => { setCanceledPaymentId(payment?.payment_id); setShowCancelDialog(true); }}
                  formatAmount={formatAmount}
                  canCancel={!isMembership}
                />
              );
            })}
          </div>
        </>
      )}

      <CancelPaymentDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        onConfirm={handleCancelConfirm}
      />

      <SuccessPaymentDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          setShowSuccessDialog(open);
          if (!open) {
            setSuccessInfo(null);
          }
        }}
        title={successInfo?.title || ''}
        formattedAmount={successInfo?.formattedAmount || ''}
        accessType={successInfo?.accessType}
      />
    </div>
  );
};

function normalizePendingPayment(raw: Record<string, unknown>): PendingPayment {
  const sub = raw.sub_payments;
  return {
    title: String(raw.title ?? ""),
    payment_id: String(raw.payment_id ?? ""),
    amount: Number(raw.amount ?? 0),
    currency: String(raw.currency ?? ""),
    sub_payments:
      sub && typeof sub === "object" && !Array.isArray(sub)
        ? (sub as Record<string, number>)
        : [],
    id: toOptionalNumber(raw.id),
    event_id: toOptionalNumber(raw.event_id),
    conference_id: toOptionalNumber(raw.conference_id),
    seminar_id: toOptionalNumber(raw.seminar_id),
    plan: typeof raw.plan === "string" ? raw.plan : undefined,
    type:
      typeof raw.type === "string"
        ? raw.type
        : typeof raw.attendance_type === "string"
        ? raw.attendance_type
        : undefined,
    mode: typeof raw.mode === "string" ? raw.mode : undefined,
    attendance_type:
      typeof raw.attendance_type === "string" ? raw.attendance_type : undefined,
  };
}

function toOptionalNumber(value: unknown): number | undefined {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : undefined;
}

export default PaymentPage;
