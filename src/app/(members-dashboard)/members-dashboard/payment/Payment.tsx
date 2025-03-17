"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFlutterwave } from 'flutterwave-react-v3';
import { showToast } from '@/utils/toast';
import type { FlutterwaveConfig, FlutterWaveResponse } from 'flutterwave-react-v3/dist/types';
import { Card, CardContent } from '@/components/ui/card';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// TypeScript Interfaces
interface PendingPayment {
  title: string;
  payment_id: string;
  amount: number;
  currency: string;
  sub_payments: Record<string, number> | [];
}

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
      const responseData = await response.json();
      
      // Check if the API returns data directly in the data field
      if (responseData.status === "success" && Array.isArray(responseData.data)) {
        setPendingPayments(responseData.data);
      } else if (responseData.payments) {
        // Fallback to the old structure if it exists
        setPendingPayments(responseData.payments);
      } else {
        // If neither structure matches, set empty array
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

  // Initialize selected plans with default values
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
      // Calculate amount based on selected plan if sub_payments exists
      let amount = payment.amount;
      const selectedPlan = selectedPlans[payment.payment_id];
     
      if (payment.sub_payments && typeof payment.sub_payments === 'object' &&
          Object.keys(payment.sub_payments).length > 0 && selectedPlan) {
        if (typeof payment.sub_payments !== 'undefined' && !Array.isArray(payment.sub_payments)) {
          amount = payment.sub_payments[selectedPlan];
        }
      }
      
      const userData = (session.user as any).userData as UserData;
     
      const config: FlutterwaveConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: `${payment.payment_id}-${Date.now()}`,
        amount: amount,
        currency: payment.currency,
        customer: {
          email: userData.email || session.user.email || '',
          name: userData.name || 'User',
          phone_number: userData.phone || '0000000000',
        },
        customizations: {
          title: payment.title,
          description: `IAIIEA ${payment.title} Payment`,
          logo: '/logo.png',
        },
        payment_options: 'bank_transfer',
      };
      
      const handleFlutterPayment = useFlutterwave(config);
      
      handleFlutterPayment({
        callback: async (response: FlutterWaveResponse) => {
          await handlePaymentCallback(response, payment);
          setProcessingStates(prev => ({ ...prev, [payment.payment_id]: false }));
        },
        onClose: () => {
          console.log('Payment modal closed');
          setCanceledPaymentId(payment.payment_id);
          setShowCancelDialog(true);
          setProcessingStates(prev => ({ ...prev, [payment.payment_id]: false }));
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      showToast.error('Payment initiation failed');
      setProcessingStates(prev => ({ ...prev, [payment.payment_id]: false }));
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
     
      if (payment.sub_payments && typeof payment.sub_payments === 'object' &&
          Object.keys(payment.sub_payments).length > 0) {
        selectedPlan = selectedPlans[payment.payment_id] || '';
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
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Show success toast
        showToast.success('Payment completed successfully!');
        // Refresh the pending payments list
        await fetchPendingPayments();
      } else {
        // Show error toast
        showToast.error(result.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      showToast.error('Payment confirmation failed');
    }
  };

  // Handle user confirming the canceled payment
  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    setCanceledPaymentId(null);
    showToast.error('Payment was canceled');
  };

  // Handle user dismissing the cancel dialog
  const handleCancelDismiss = () => {
    setShowCancelDialog(false);
    setCanceledPaymentId(null);
  };

  const SkeletonCard = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  const PaymentCard: React.FC<{
    payment: PendingPayment;
  }> = ({ payment }) => {
    const isProcessing = processingStates[payment.payment_id];
    const hasSubPayments = payment.sub_payments && 
                          typeof payment.sub_payments === 'object' && 
                          Object.keys(payment.sub_payments).length > 0;

    const formatAmount = (amount: number, currency: string) => {
      return currency === 'USD' 
        ? `$${amount.toLocaleString()}`
        : `${currency} ${amount.toLocaleString()}`;
    };

    return (
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold mb-2">{payment.title}</h3>
              <p className="text-2xl font-bold text-gray-700">
                {hasSubPayments && selectedPlans[payment.payment_id] 
                  ? formatAmount((payment.sub_payments as Record<string, number>)[selectedPlans[payment.payment_id]], payment.currency)
                  : formatAmount(payment.amount, payment.currency)
                }
              </p>
              <p className="text-gray-500 text-sm mt-1">Payment ID: {payment.payment_id}</p>
            </div>
            <div className="flex items-center gap-4">
              {hasSubPayments && (
                <Select
                  onValueChange={(value: string) => 
                    setSelectedPlans(prev => ({ ...prev, [payment.payment_id]: value }))
                  }
                  defaultValue={Object.keys(payment.sub_payments)[0]}
                  value={selectedPlans[payment.payment_id]}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(payment.sub_payments).map(([planName, planAmount]) => (
                      <SelectItem key={planName} value={planName}>
                        {planName} ({formatAmount(planAmount, payment.currency)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <button
                onClick={() => initiatePayment(payment)}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#0E1A3D] hover:bg-primary/90 text-white rounded-lg transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Make Payment'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }
  
  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-100 px-5 py-3 mb-6 rounded-lg">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Payments</h1>
      </div>
  
      {pendingPayments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">You have no pending payments.</p>
        </div>
      ) : (
        <>
          <Alert className="mb-6">
            <AlertDescription>
              You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''} to make
            </AlertDescription>
          </Alert>
          
          <div className="space-y-4">
            {pendingPayments.map((payment) => (
              <PaymentCard key={payment.payment_id} payment={payment} />
            ))}
          </div>
        </>
      )}
      
      {/* Cancel Payment Dialog */}
      <AlertDialog.Root open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
          <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
            <AlertDialog.Title className="text-lg font-semibold">
              Cancel Payment
            </AlertDialog.Title>
            <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
              Are you sure you want to cancel this payment? You can make the payment later.
            </AlertDialog.Description>
            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel asChild>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                  Go Back
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button 
                  onClick={handleCancelConfirm} 
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Confirm Cancel
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
      
    </div>
  );
};

export default PaymentPage;