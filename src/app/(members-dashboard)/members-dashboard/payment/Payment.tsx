"use client"
import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFlutterwave } from 'flutterwave-react-v3';
import { showToast } from '@/utils/toast';
import type { FlutterwaveConfig, FlutterWaveResponse } from 'flutterwave-react-v3/dist/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PaymentCard from './PaymentCard';
import LoadingSkeleton from './LoadingSkeleton';
import CancelPaymentDialog from './CancelPaymentDialog';
import type { PendingPayment } from './types';

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface UserData {
  registration: string;
  email?: string;
  name?: string;
  phone?: string;
}

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({});
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>([]);
  const [selectedPlans, setSelectedPlans] = useState<Record<string, string>>({});
  const [canceledPaymentId, setCanceledPaymentId] = useState<string | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const { data: session, status } = useSession();
  const router = useRouter();
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
        await signOut({ callbackUrl: '/login' });
        return;
      }

      const responseData = await response.json();
      
      if (responseData.status === "success" && Array.isArray(responseData.data)) {
        setPendingPayments(responseData.data);
      } else if (responseData.payments) {
        setPendingPayments(responseData.payments);
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

  const initiatePayment = async (payment: PendingPayment) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }
    
    setProcessingStates(prev => ({ ...prev, [payment.payment_id]: true }));
    
    try {
      let amount = payment.amount;
      const selectedPlan = selectedPlans[payment?.payment_id];
     
      if (payment?.sub_payments && typeof payment?.sub_payments === 'object' &&
          Object.keys(payment?.sub_payments).length > 0 && selectedPlan) {
        if (typeof payment?.sub_payments !== 'undefined' && !Array.isArray(payment?.sub_payments)) {
          amount = payment?.sub_payments[selectedPlan];
        }
      }
      
      const userData = (session.user as any).userData as UserData;
     
      const config: FlutterwaveConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: `${payment?.payment_id}-${Date.now()}`,
        amount: amount,
        currency: payment?.currency,
        customer: {
          email: userData?.email || session?.user?.email || '',
          name: userData?.name || 'User',
          phone_number: userData?.phone || '0000000000',
        },
        customizations: {
          title: payment?.title,
          description: `IAIIEA ${payment?.title} Payment`,
          logo: '/logo.png',
        },
        payment_options: 'bank_transfer',
      };
      
      const handleFlutterPayment = useFlutterwave(config);
      
      handleFlutterPayment({
        callback: async (response: FlutterWaveResponse) => {
          await handlePaymentCallback(response, payment);
          setProcessingStates(prev => ({ ...prev, [payment?.payment_id]: false }));
        },
        onClose: () => {
          console.log('Payment modal closed');
          setCanceledPaymentId(payment?.payment_id);
          setShowCancelDialog(true);
          setProcessingStates(prev => ({ ...prev, [payment?.payment_id]: false }));
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      showToast.error('Payment initiation failed');
      setProcessingStates(prev => ({ ...prev, [payment?.payment_id]: false }));
    }
  };
  
  const handlePaymentCallback = async (
    transaction: FlutterWaveResponse,
    payment: PendingPayment
  ) => {
    try {
      if (!session?.user) {
        console.error('Invalid session');
        showToast.error('Invalid session');
        return;
      }
     
      const amountPaid = transaction.amount;
      let selectedPlan = '';
     
      if (payment?.sub_payments && typeof payment?.sub_payments === 'object' &&
          Object.keys(payment.sub_payments).length > 0) {
        selectedPlan = selectedPlans[payment?.payment_id] || '';
      }
      
      const confirmPayload = {
        payment_id: payment.payment_id,
        processor_id: transaction.transaction_id?.toString() || '',
        paid: amountPaid,
        plan: selectedPlan || undefined
      };
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/confirm_payment/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bearerToken}`
        },
        body: JSON.stringify(confirmPayload)
      });

      if (response.status === 401 || response.status === 403) {
        await signOut({ callbackUrl: '/login' });
        return;
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        showToast.success('Payment completed successfully!');
        await fetchPendingPayments();
        try { router.refresh(); } catch {}
      } else {
        showToast.error(result.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      showToast.error('Payment confirmation failed');
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
        await signOut({ callbackUrl: '/login' });
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




  if (status === "loading" || loading) {
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
    </div>
  );
};

export default PaymentPage;