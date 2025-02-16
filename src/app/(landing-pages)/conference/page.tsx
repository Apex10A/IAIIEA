'use client';

import { useEffect, useState } from 'react';
import '@/app/index.css';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock, Book } from 'lucide-react';

// Types
interface PaymentTier {
  usd: string;
  naira: string;
}

interface RegistrationType {
  virtual: PaymentTier;
  physical: PaymentTier;
}

interface ConferencePayments {
  early_bird_registration: RegistrationType;
  normal_registration: RegistrationType;
  late_registration: RegistrationType;
  tour: RegistrationType;
  annual_dues: RegistrationType;
  vetting_fee: RegistrationType;
  publication_fee: RegistrationType;
}

interface ConferenceSummary {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: 'Completed' | 'Ongoing' | 'Upcoming';
  resources: any[];
}

interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  flyer: string;
  gallery: string[];
  sponsors: string[];
  videos: string[];
  payments: ConferencePayments;
  status: string;
  resources: any[];
  schedule: any[];
  meals: Meal[];
}

interface Meal {
  meal_id: number;
  name: string;
  image: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

// API Functions
const fetchConferences = async (bearerToken: string): Promise<ApiResponse<ConferenceSummary[]>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conferences');
  }

  return await response.json();
};

const fetchConferenceDetails = async (id: number, bearerToken: string): Promise<ApiResponse<ConferenceDetails>> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${id}`, {
    headers: {
      Authorization: `Bearer ${bearerToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch conference details');
  }

  return await response.json();
};

// Main Component
export default function ConferencePage() {
  const { data: session, status } = useSession();
  const [conference, setConference] = useState<ConferenceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadConference = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        setError('Please sign in to view conference details');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const bearerToken = session?.user?.token || session?.user?.userData?.token;
        
        if (!bearerToken) {
          throw new Error('Authentication token not found');
        }

        const confsResponse = await fetchConferences(bearerToken);
        const activeConf = confsResponse.data.find(
          conf => conf.status === 'Ongoing' || conf.status === 'Upcoming'
        );

        if (activeConf) {
          const detailsResponse = await fetchConferenceDetails(activeConf.id, bearerToken);
          setConference(detailsResponse.data);
        } else {
          setError('No upcoming or ongoing conferences found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conference details');
      } finally {
        setLoading(false);
      }
    };

    loadConference();
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return <div className="flex justify-center items-center min-h-screen">Please sign in to view conference details</div>;
  }

  if (error || !conference) {
    return <div className="flex justify-center items-center min-h-screen">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{conference.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{conference.theme}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>{conference.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>{conference.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>{conference.start_time}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="workshops">Workshops</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sub-themes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                {conference.sub_theme.map((theme, index) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {conference.important_date.map((date, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {date}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registration Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="font-semibold">Early Bird Registration</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Virtual: ${conference.payments.early_bird_registration.virtual.usd}</div>
                    <div>Physical: ${conference.payments.early_bird_registration.physical.usd}</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Normal Registration</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>Virtual: ${conference.payments.normal_registration.virtual.usd}</div>
                    <div>Physical: ${conference.payments.normal_registration.physical.usd}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Workshops</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {conference.work_shop.map((workshop, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Book className="w-4 h-4" />
                    {workshop}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Conference Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {conference.schedule.length > 0 ? (
                <div className="space-y-4">
                  {/* Add schedule content here when available */}
                </div>
              ) : (
                <p>Schedule will be announced soon.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}