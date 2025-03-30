"use client";

import { useEffect, useState } from "react";
import "@/app/index.css";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Book, Check, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
          <div className="text-2xl md:text-4xl font-bold text-white">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-xs md:text-sm">Days</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
          <div className="text-2xl md:text-4xl font-bold text-white">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-xs md:text-sm">Hours</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
          <div className="text-2xl md:text-4xl font-bold text-white">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-xs md:text-sm">Minutes</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
          <div className="text-2xl md:text-4xl font-bold text-white">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-white/80 text-xs md:text-sm">Seconds</div>
        </div>
      </div>
    </div>
  );
};

// Carousel Component for Gallery & Sponsors
const Carousel = ({ 
  items, 
  showArrows = true 
}: { 
  items: string[]; 
  showArrows?: boolean 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalPages) % totalPages);
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalPages);
  };
  
  const startIndex = currentIndex * itemsPerPage;
  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div className="relative">
      <div className="flex items-center justify-center">
        {showArrows && (
          <button 
            onClick={goToPrevious}
            className="absolute left-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        
        <div className="flex justify-center items-center gap-4 my-4 overflow-hidden">
          {visibleItems.length > 0 ? (
            visibleItems.map((item, idx) => (
              <div key={idx} className="w-full max-w-xs h-48 rounded-lg overflow-hidden">
                <img 
                  src={item || "/api/placeholder/320/240"} 
                  alt={`Item ${startIndex + idx + 1}`}
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.src = "/api/placeholder/320/240";
                  }}
                />
              </div>
            ))
          ) : (
            <div className="text-white opacity-70">No items available</div>
          )}
        </div>
        
        {showArrows && (
          <button 
            onClick={goToNext}
            className="absolute right-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}
      </div>
      
      {showArrows && totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full ${
                idx === currentIndex ? 'bg-[#D5B93C]' : 'bg-white/30'
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
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
          throw new Error("Please Login to view this page");
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D5B93C]"></div>
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="flex justify-center conference-bg items-center min-h-screen">
        <p className="text-2xl text-white opacity-70">{error}</p>
      </div>
    );
  }

  return (
    <div className="conference-bg min-h-screen pt-16 md:pt-24 px-4 md:px-8 lg:px-16 w-full">
      {/* Header with Countdown and Button */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 md:pt-20 gap-6">
        <div className="w-full md:w-auto">
          {conferenceDate && <CountdownTimer targetDate={conferenceDate} />}
        </div>
        <div>
          <button className="bg-[#D5B93C] px-4 sm:px-8 py-3 font-bold uppercase text-[#0E1A3D] rounded-md w-full md:w-auto">
            Conference portal
          </button>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#D5B93C] mb-6 max-w-full md:max-w-3/4 lg:max-w-[60%] leading-tight">{conference.theme}</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            <span>{conference.date}</span>
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

      {/* Main Content - Landing Page Style */}
      <div className="space-y-12">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sub-themes */}
            <Card className="bg-white/5 backdrop-blur-sm border-none text-white">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Sub-themes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference.sub_theme.map((theme, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Workshops */}
            <Card className="bg-white/5 backdrop-blur-sm border-none text-white">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference.work_shop.map((workshop, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span>{workshop}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Important Dates */}
          <Card className="bg-white/5 backdrop-blur-sm border-none text-white mt-6">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {conference.important_date.map((date, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Schedule Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Conference Schedule</h2>
          
          <Card className="bg-white/5 backdrop-blur-sm border-none text-white">
            <CardContent className="pt-6">
              {conference.schedule && conference.schedule.length > 0 ? (
                <div className="space-y-4">
                  {conference.schedule.map((item, index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div className="font-semibold mb-2 sm:mb-0">
                          {item.time || 'Time TBA'}
                        </div>
                        <div className="text-[#D5B93C]">
                          {item.date || 'Date TBA'}
                        </div>
                      </div>
                      <div className="mt-2">{item.title || item.description || 'Details coming soon'}</div>
                      {item.speaker && (
                        <div className="mt-1 text-white/70">
                          Speaker: {item.speaker}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-white/70">Schedule will be announced soon.</p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Gallery Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Gallery</h2>
          
          {conference.gallery && conference.gallery.length > 0 ? (
            <Carousel items={conference.gallery} />
          ) : (
            <p className="text-center py-6 text-white/70">Photos will be available soon.</p>
          )}
        </section>

        {/* Registration Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Registration Information</h2>
          
          <Card className="bg-white/5 backdrop-blur-sm border-none text-white">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(conference.payments).map(
                  ([category, types], index) => (
                    <div key={index} className="border-b border-white/10 pb-4 last:border-0">
                      <h3 className="font-semibold capitalize text-[#D5B93C] mb-3">
                        {category.replace(/_/g, " ")}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/10 p-3 rounded-md">
                          <div className="font-medium mb-1">Virtual</div>
                          <div className="flex justify-between">
                            <span>${types.virtual.usd}</span>
                            <span>NGN {types.virtual.naira}</span>
                          </div>
                        </div>
                        <div className="bg-white/10 p-3 rounded-md">
                          <div className="font-medium mb-1">Physical</div>
                          <div className="flex justify-between">
                            <span>${types.physical.usd}</span>
                            <span>NGN {types.physical.naira}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
              
              <div className="flex justify-center mt-6">
                <button className="bg-[#D5B93C] px-8 py-3 font-bold uppercase text-[#0E1A3D] rounded-md">
                  Register Now
                </button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Paper Flyer Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Conference Flyer</h2>
          
          {conference.flyer ? (
            <div className="flex justify-center">
              <img 
                src={conference.flyer} 
                alt="Conference Flyer" 
                className="max-w-full h-auto max-h-[70vh] rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/400/600";
                }} 
              />
            </div>
          ) : (
            <p className="text-center py-6 text-white/70">Flyer will be available soon.</p>
          )}
        </section>

        {/* Sponsors Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Our Sponsors</h2>
          
          {conference.sponsors && conference.sponsors.length > 0 ? (
            <Carousel items={conference.sponsors} showArrows={false} />
          ) : (
            <p className="text-center py-6 text-white/70">Sponsor information will be available soon.</p>
          )}
        </section>

         {/* Videos Section */}
         <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-[#D5B93C] pb-2">Videos</h2>
          
          {conference.videos && conference.videos.length > 0 ? (
            <Carousel items={conference.videos} showArrows={false} />
          ) : (
            <p className="text-center py-6 text-white/70">Video information will be available soon.</p>
          )}
        </section>
      </div>
      
      
    </div>
  );
}