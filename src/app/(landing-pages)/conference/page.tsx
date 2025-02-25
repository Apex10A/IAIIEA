"use client";

import { useEffect, useState } from "react";
import "@/app/index.css";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Book } from "lucide-react";

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
  status: "Completed" | "Ongoing" | "Incoming";
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

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// API Functions
const fetchConferences = async (
  bearerToken: string
): Promise<ApiResponse<ConferenceSummary[]>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/landing/events`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conferences");
  }

  return await response.json();
};

const fetchConferenceDetails = async (
  id: number,
  bearerToken: string
): Promise<ApiResponse<ConferenceDetails>> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${id}`,
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch conference details");
  }

  return await response.json();
};

// Countdown Timer Component
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex justify-center mb-8">
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-4xl font-bold text-white">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-sm">Days</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-4xl font-bold text-white">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-sm">Hours</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-4xl font-bold text-white">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-sm">Minutes</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="text-4xl font-bold text-white">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-sm">Seconds</div>
        </div>
      </div>
    </div>
  );
};

// Main Component
export default function ConferencePage() {
  const { data: session, status } = useSession();
  const [conference, setConference] = useState<ConferenceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conferenceDate, setConferenceDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadConference = async () => {
      if (status === "loading") return;

      try {
        setLoading(true);
        const bearerToken =
          session?.user?.token || session?.user?.userData?.token;

        if (!bearerToken) {
          throw new Error("Authentication token not found");
        }

        const confsResponse = await fetchConferences(bearerToken);
        const activeConf = confsResponse.data.find(
          (conf) => conf.status === "Ongoing" || conf.status === "Incoming"
        );

        if (activeConf) {
          const detailsResponse = await fetchConferenceDetails(
            activeConf.id,
            bearerToken
          );
          setConference(detailsResponse.data);
          
          // Parse and set the conference date for countdown
          const { start_date, start_time } = detailsResponse.data;
          const dateTimeString = `${start_date}T${start_time}`;
          const conferenceDateTime = new Date(dateTimeString);
          setConferenceDate(conferenceDateTime);
        } else {
          setError("No Incoming or ongoing conferences found");
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load conference details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConference();
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  // if (!session) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       Please sign in to view conference details
  //     </div>
  //   );
  // }

  if (error || !conference) {
    return (
      <div className="flex justify-center conference-bg items-center min-h-screen">
        <p className="text-2xl text-white opacity-[0.7]">{error}</p>
      </div>
    );
  }

  return (
    <div className="conference-bg mx-auto min-h-screen pt-24 py-8 px-16 w-full">
      {/* Countdown Timer */}
      <div className="flex items-center justify-between w-full pt-20">
      <div className="text-center">
        {/* <h2 className="text-2xl font-semibold text-white mb-4">Time Remaining Until Conference</h2> */}
        {conferenceDate && <CountdownTimer targetDate={conferenceDate} />}
      </div>
      <div>
      <button className="bg-[#D5B93C] px-8 py-3 text-[#0E1A3D] rounded-md">
              Status: Not Registered
      </button>
      </div>
      </div>
      
      {/* Hero Section */}
      <div className="mb-12 ">
        {/* <h1 className="text-5xl font-bold mb-4  text-white">{conference.title}</h1> */}
        <h1 className="text-5xl font-bold text-[#D5B93C] mb-6 max-w-[60%] leading-24">{conference.theme}</h1>
        <div className="flex flex-wrap  gap-4">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            <span className=''>{conference.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span>{conference.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span>{conference.start_time}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="grid w-full grid-cols-5 lg:w-[550px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="paper flyer">Paper flyer</TabsTrigger>
          <TabsTrigger value="Gallery">Gallery</TabsTrigger>
        
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
                {Object.entries(conference.payments).map(
                  ([category, types], index) => (
                    <div key={index}>
                      <div className="space-y-4">
                        <h3 className="font-semibold capitalize">
                          {category.replace(/_/g, " ")}
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            Virtual: ${types.virtual.usd} (NGN {types.virtual.naira})
                          </div>
                          <div>
                            Physical: ${types.physical.usd} (NGN {types.physical.naira})
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
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
              {conference.schedule && conference.schedule.length > 0 ? (
                <div className="space-y-4">
                  {/* Add schedule content here when available */}
                </div>
              ) : (
                <p>Schedule will be announced soon.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paper flyer">
          <Card>
            <CardHeader>
              <CardTitle>Conference Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {conference.schedule && conference.schedule.length > 0 ? (
                <div className="space-y-4">
                  {/* Add schedule content here when available */}
                </div>
              ) : (
                <p>Schedule will be announced soon.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="Gallery">
          <Card>
            <CardHeader>
              <CardTitle>Conference Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {conference.schedule && conference.schedule.length > 0 ? (
                <div className="space-y-4">
                  {/* Add schedule content here when available */}
                </div>
              ) : (
                <p>Schedule will be announced soon.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Conference Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {conference.schedule && conference.schedule.length > 0 ? (
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