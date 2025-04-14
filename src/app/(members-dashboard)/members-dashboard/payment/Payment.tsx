"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFlutterwave } from 'flutterwave-react-v3';
import { showToast } from '@/utils/toast';
import type { FlutterwaveConfig, FlutterWaveResponse } from 'flutterwave-react-v3/dist/types';
import { Card, CardContent } from '@/components/ui/card';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
        showToast.success('Payment completed successfully!');
        await fetchPendingPayments();
      } else {
        showToast.error(result.message || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      showToast.error('Payment confirmation failed');
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    setCanceledPaymentId(null);
    showToast.error('Payment was canceled');
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

  const PaymentCard: React.FC<{
    payment: PendingPayment;
  }> = ({ payment }) => {
    const isProcessing = processingStates[payment.payment_id];
    const hasSubPayments = payment.sub_payments && 
                          typeof payment.sub_payments === 'object' && 
                          Object.keys(payment.sub_payments).length > 0;
                          return (
                            <Card className="mb-6 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <h3 className="text-lg font-semibold text-gray-900">{payment.title}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        {payment.currency}
                                      </Badge>
                                    </div>
                                    <p className="text-2xl font-bold text-primary">
                                      {hasSubPayments && selectedPlans[payment.payment_id] 
                                        ? formatAmount((payment.sub_payments as Record<string, number>)[selectedPlans[payment.payment_id]], payment.currency)
                                        : formatAmount(payment.amount, payment.currency)
                                      }
                                    </p>
                                    <p className="text-sm text-gray-500">Payment ID: {payment.payment_id}</p>
                                  </div>
                                  
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    {hasSubPayments && (
                                      <Select
                                        onValueChange={(value: string) => 
                                          setSelectedPlans(prev => ({ ...prev, [payment.payment_id]: value }))
                                        }
                                        defaultValue={Object.keys(payment.sub_payments)[0]}
                                        value={selectedPlans[payment.payment_id]}
                                      >
                                        <SelectTrigger className="w-[200px]">
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
                                    
                                    <Button
                                      onClick={() => initiatePayment(payment)}
                                      disabled={isProcessing}
                                      className="w-full sm:w-auto"
                                    >
                                      {isProcessing ? (
                                        <span className="flex items-center gap-2">
                                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          Processing...
                                        </span>
                                      ) : 'Make Payment'}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        };
                          
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-100 rounded w-3/4 animate-pulse"></div>
            <div className="h-8 bg-gray-100 rounded w-1/4 animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-100 rounded w-48 animate-pulse"></div>
              <div className="h-10 bg-gray-100 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

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

  // ... (keep the rest of your existing code, including PaymentCard component)

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
            <AlertTitle className="flex items-center gap-2">
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg> */}
              Pending Payments
            </AlertTitle>
            <AlertDescription>
              You have {pendingPayments.length} pending payment{pendingPayments.length > 1 ? 's' : ''} to complete.
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
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0 backdrop-blur-sm" />
          <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-red-100 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <AlertDialog.Title className="text-lg font-semibold text-gray-900">
                Cancel Payment
              </AlertDialog.Title>
            </div>
            <AlertDialog.Description className="text-gray-600 mb-6">
              Are you sure you want to cancel this payment? You can make the payment later from your dashboard.
            </AlertDialog.Description>
            <div className="flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <Button variant="outline">
                  Continue Payment
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <Button 
                  variant="destructive"
                  onClick={handleCancelConfirm}
                >
                  Cancel Payment
                </Button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default PaymentPage;