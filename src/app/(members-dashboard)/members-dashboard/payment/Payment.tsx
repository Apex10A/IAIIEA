import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFlutterwave, FlutterwaveConfig } from 'flutterwave-react-v3';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// TypeScript Interfaces
interface UserData {
  registration: string;
  email?: string;
  name?: string;
  phone?: string;
}

interface Conference {
  id: number;
  title: string;
  date: string;
  status: string;
}

interface Seminar {
  id: number;
  title: string;
  date: string;
  status: string;
}

interface PaymentTransaction {
  status: string;
  transaction_id?: string;
  tx_ref: string;
}

type PaymentType = 'membership' | 'conference' | 'seminar';
type PlanType = 'basic' | 'standard' | 'premium';

const PAYMENT_PLANS: PlanType[] = ['basic', 'standard', 'premium'];

// Skeleton Loading Component
const SkeletonLoading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
      
      <div className="mb-8">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 rounded-lg"></div>
          <div className="h-40 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [hasMembershipAccess, setHasMembershipAccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('basic');

  const { data: session, status } = useSession();
  const router = useRouter();

  const membershipYears = [
    { year: '2024', amount: 50000, title: '2024 Membership Payment' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const userData = (session.user as any).userData as UserData;
          setHasMembershipAccess(userData?.registration === 'complete');

          const confResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
          const confData = await confResponse.json();
          setConferences(confData.data || []);

          const semResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
          const semData = await semResponse.json();
          setSeminars(semData.data || []);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        router.push('/login');
      }
    };

    fetchData();
  }, [status, session, router]);

  const initiatePayment = (type: PaymentType, amount: number, itemId: number | null = null, title = '') => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    const userData = (session.user as any).userData as UserData;

    const config: FlutterwaveConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
      tx_ref: `${type}-${itemId || 'membership'}-${Date.now()}`,
      amount: amount,
      currency: 'NGN',
      customer: {
        email: userData.email || session.user.email || '',
        name: userData.name || 'User',
        phone_number: userData.phone || '0000000000',
      },
      customizations: {
        title: title,
        description: `IAIIEA ${type} Payment`,
        logo: '/logo.png',
      },
      payment_options: 'card,ussd,bank_transfer',
    };

    const handleFlutterPayment = useFlutterwave(config);

    handleFlutterPayment({
      callback: (transaction: PaymentTransaction) => handlePaymentCallback(transaction, type, itemId),
      onClose: () => console.log('Payment modal closed'),
    });
  };

  const handlePaymentCallback = async (
    transaction: PaymentTransaction, 
    type: PaymentType, 
    itemId: number | null
  ) => {
    // Implement payment callback logic here
    console.log('Payment completed:', transaction);
  };

  const getAmountForPlan = (plan: PlanType): number => {
    const pricing: Record<PlanType, number> = {
      basic: 25000,
      standard: 50000,
      premium: 75000
    };
    return pricing[plan];
  };

  const renderMembershipSection = () => {
    if (hasMembershipAccess) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Membership Payment</h2>
          <p className="text-gray-600">You have no pending membership payments.</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Membership Payment</h2>
        <Alert className="mb-4">
          <AlertDescription>
            You have a pending membership payment to make for 2024
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">2024 Membership Payment</h3>
            <p className="text-2xl font-bold mb-4">₦{(50000).toLocaleString()}</p>
            <button
              onClick={() => initiatePayment('membership', 50000, null, '2024 Membership Payment')}
              disabled={isProcessing}
              className="w-full px-4 py-2 rounded-full bg-primary hover:bg-primary/90 text-white font-semibold disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Make Payment'}
            </button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderConferenceSection = () => {
    const ongoingConferences = conferences.filter(conf => conf.status === 'Ongoing');

    if (ongoingConferences.length === 0) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Conference Payment</h2>
          <p className="text-gray-600">You have no pending conference payments.</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Conference Payment</h2>
        <Alert className="mb-4">
          <AlertDescription>
            You have pending conference payments to make
          </AlertDescription>
        </Alert>
        {ongoingConferences.map(conference => (
          <Card key={conference.id} className="mb-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{conference.title}</h3>
              <p className="text-gray-600 mb-2">{conference.date}</p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {PAYMENT_PLANS.map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-4 py-2 rounded ${
                        selectedPlan === plan 
                          ? 'bg-[#0E1A3D] text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => initiatePayment('conference', getAmountForPlan(selectedPlan), conference.id, conference.title)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 rounded-full bg-[#0E1A3D] hover:bg-primary/90 text-white font-semibold disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  const renderSeminarSection = () => {
    const ongoingSeminars = seminars.filter(seminar => seminar.status === 'Ongoing');

    if (ongoingSeminars.length === 0) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Seminar Payment</h2>
          <p className="text-gray-600">You have no pending seminar payments.</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Seminar Payment</h2>
        <Alert className="mb-4">
          <AlertDescription>
            You have pending seminar payments to make
          </AlertDescription>
        </Alert>
        {ongoingSeminars.map(seminar => (
          <Card key={seminar.id} className="mb-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{seminar.title}</h3>
              <p className="text-gray-600 mb-2">{seminar.date}</p>
              <div className="space-y-4">
                <div className="flex gap-4">
                  {PAYMENT_PLANS.map((plan) => (
                    <button
                      key={plan}
                      onClick={() => setSelectedPlan(plan)}
                      className={`px-4 py-2 rounded ${
                        selectedPlan === plan 
                          ? 'bg-[#0E1A3D] text-white' 
                          : 'bg-gray-100'
                      }`}
                    >
                      {plan.charAt(0).toUpperCase() + plan.slice(1)}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => initiatePayment('seminar', getAmountForPlan(selectedPlan), seminar.id, seminar.title)}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 rounded-full bg-[#0E1A3D] hover:bg-primary/90 text-white font-semibold disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Make Payment'}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SkeletonLoading />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="text-lg">
          Home {'>'} <span className="font-semibold">Payment</span>
        </p>
      </div>

      {renderMembershipSection()}
      {renderConferenceSection()}
      {renderSeminarSection()}
    </div>
  );
};

export default PaymentPage;