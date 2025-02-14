import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useFlutterwave } from 'flutterwave-react-v3';
import type { FlutterwaveConfig, FlutterWaveResponse } from 'flutterwave-react-v3/dist/types';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// TypeScript Interfaces
interface UserData {
  registration: string;
  email?: string;
  name?: string;
  phone?: string;
}

interface EventBase {
  id: number;
  title: string;
  date: string;
  status: 'Incoming' | 'Ongoing';
}

interface Conference extends EventBase {
  theme: string;
  venue: string;
  resources: any[];
}

interface Seminar extends EventBase {
  theme: string;
  venue: string;
  resources: any[];
}

interface EventDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

interface PaymentData {
  payment_id: string;
  amount: number;
}

const PaymentPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [conferenceDetails, setConferenceDetails] = useState<Record<number, EventDetails>>({});
  const [seminarDetails, setSeminarDetails] = useState<Record<number, EventDetails>>({});
  const [hasMembershipAccess, setHasMembershipAccess] = useState(false);
  
  const { data: session, status } = useSession();
  const router = useRouter();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    const fetchData = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          // Check membership status
          const userData = (session.user as any).userData as UserData;
          setHasMembershipAccess(userData?.registration === 'complete');

          // Fetch conferences
          const confResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
          const confData: ApiResponse<Conference[]> = await confResponse.json();
          const relevantConferences = (confData.data || []).filter(
            conf => conf.status === 'Incoming' || conf.status === 'Ongoing'
          );
          setConferences(relevantConferences);

          // Fetch seminars
          const semResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
          const semData: ApiResponse<Seminar[]> = await semResponse.json();
          const relevantSeminars = (semData.data || []).filter(
            sem => sem.status === 'Incoming' || sem.status === 'Ongoing'
          );
          setSeminars(relevantSeminars);

          // Fetch details for each conference
          for (const conf of relevantConferences) {
            const detailsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conf.id}`
            );
            const detailsData: ApiResponse<EventDetails> = await detailsResponse.json();
            setConferenceDetails(prev => ({
              ...prev,
              [conf.id]: detailsData.data
            }));
          }

          // Fetch details for each seminar
          for (const sem of relevantSeminars) {
            const detailsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${sem.id}`
            );
            const detailsData: ApiResponse<EventDetails> = await detailsResponse.json();
            setSeminarDetails(prev => ({
              ...prev,
              [sem.id]: detailsData.data
            }));
          }
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

  const initiatePayment = async (
    type: 'membership' | 'conference' | 'seminar',
    amount: number,
    itemId?: number,
    title = ''
  ) => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    try {
      let paymentData: PaymentData | null = null;

      if (type === 'conference') {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/conference/initiate_pay/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${bearerToken}`
          },
          body: JSON.stringify({ id: itemId })
        });

        const data = await response.json();
        if (data.status === 'success') {
          paymentData = data.data;
        }
      }

      const userData = (session.user as any).userData as UserData;
      
      const config: FlutterwaveConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: `${type}-${itemId || 'payment'}-${Date.now()}`,
        amount: paymentData?.amount || amount,
        currency: 'NGN',
        customer: {
          email: userData.email || session.user.email || '',
          name: userData.name || 'User',
          phone_number: userData.phone || '0000000000',
        },
        customizations: {
          title: title || `IAIIEA ${type} Payment`,
          description: `IAIIEA ${type} Payment`,
          logo: '/logo.png',
        },
        payment_options: 'card,ussd,bank_transfer',
      };

      const handleFlutterPayment = useFlutterwave(config);

      handleFlutterPayment({
        callback: async (response: FlutterWaveResponse) => {
          await handlePaymentCallback(response, type, itemId, paymentData);
        },
        onClose: () => {
          console.log('Payment modal closed');
          setIsProcessing(false);
        },
      });
    } catch (error) {
      console.error('Payment initiation error:', error);
      setIsProcessing(false);
    }
  };

  const handlePaymentCallback = async (
    transaction: FlutterWaveResponse,
    type: string,
    itemId?: number,
    paymentData?: PaymentData | null
  ) => {
    try {
      if (!session?.user || !paymentData?.payment_id) {
        console.error('Invalid session or payment data');
        return;
      }

      const confirmPayload = {
        payment_id: paymentData.payment_id,
        processor_id: transaction.transaction_id?.toString() || '',
        paid: paymentData.amount
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
        // Refresh the page or update state as needed
        window.location.reload();
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
    }
  };

  const SkeletonCard = () => (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    </div>
  );

  const EventCard: React.FC<{
    event: EventBase;
    type: 'conference' | 'seminar';
    isRegistered: boolean;
  }> = ({ event, type, isRegistered }) => (
    <Card className="mb-4 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-2">{event.date}</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 
              ${event.status === 'Incoming' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
              {event.status}
            </span>
          </div>
          {!isRegistered && (
            <button
              onClick={() => initiatePayment(type, 50000, event.id, event.title)}
              disabled={isProcessing}
              className="px-6 py-2 bg-[#0E1A3D] hover:bg-primary/90 text-white rounded-lg transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Make Payment'}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const MembershipSection = () => {
    if (hasMembershipAccess) {
      return (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Membership Payment</h2>
          <p className="text-gray-600">You have no pending membership payments.</p>
        </div>
      );
    }

    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Membership Payment</h2>
        <Alert className="mb-4">
          <AlertDescription>
            You have a pending membership payment to make for 2024
          </AlertDescription>
        </Alert>
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold mb-2">2024 Membership Payment</h3>
                <p className="text-2xl font-bold text-gray-700">₦{(50000).toLocaleString()}</p>
              </div>
              <button
                onClick={() => initiatePayment('membership', 50000, undefined, '2024 Membership Payment')}
                disabled={isProcessing}
                className="px-6 py-2 bg-[#0E1A3D] hover:bg-primary/90 text-white rounded-lg transition-colors
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Make Payment'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gray-100 px-5 py-3 mb-6 rounded-lg">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Payments</h1>
      </div>

      {/* Membership Section */}
      <MembershipSection />

      {/* Conferences Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Conference Payments</h2>
        {conferences.length === 0 ? (
          <p className="text-gray-600">No pending conference payments.</p>
        ) : (
          <>
            <Alert className="mb-4">
              <AlertDescription>
                You have pending conference payments to make
              </AlertDescription>
            </Alert>
            {conferences.map(conference => (
              <EventCard
                key={conference.id}
                event={conference}
                type="conference"
                isRegistered={conferenceDetails[conference.id]?.is_registered ?? false}
              />
            ))}
          </>
        )}
      </section>

      {/* Seminars Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Seminar Payments</h2>
        {seminars.length === 0 ? (
          <p className="text-gray-600">No pending seminar payments.</p>
        ) : (
          <>
            <Alert className="mb-4">
              <AlertDescription>
                You have pending seminar payments to make
              </AlertDescription>
            </Alert>
            {seminars.map(seminar => (
              <EventCard
                key={seminar.id}
                event={seminar}
                type="seminar"
                isRegistered={seminarDetails[seminar.id]?.is_registered ?? false}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default PaymentPage;