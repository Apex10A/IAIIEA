"use client";
import { useEffect, useState } from "react";
import "@/app/index.css";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Clock, Book, Check, ChevronLeft, ChevronRight, User, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/utils/toast";

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

interface Speaker {
  name: string;
  title: string;
  portfolio: string;
  picture: string;
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
  meals: any[];
  speakers: Speaker[];
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
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
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
    <div className="flex justify-center mb-6 md:mb-0">
      <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {String(value).padStart(2, '0')}
            </div>
            <div className="text-white/80 text-xs md:text-sm capitalize">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Carousel = ({ items, showArrows = true }: { items: string[]; showArrows?: boolean }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + items.length) % items.length);
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length);
  };
  
  return (
    <div className="relative group">
      <div className="flex items-center justify-center">
        {showArrows && items.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            
            <button 
              onClick={goToNext}
              className="absolute right-0 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-colors opacity-0 group-hover:opacity-100"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </>
        )}
        
        <div className="flex justify-center items-center gap-4 my-4 overflow-hidden w-full">
          {items.length > 0 ? (
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              <img 
                src={items[currentIndex] || "/placeholder.jpg"} 
                alt={`Item ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out" 
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            </div>
          ) : (
            <div className="text-white opacity-70 py-12">No items available</div>
          )}
        </div>
      </div>
      
      {items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-[#D5B93C] w-4' : 'bg-white/30'
              }`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ConferencePage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [conference, setConference] = useState<ConferenceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conferenceDate, setConferenceDate] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  useEffect(() => {
    const loadConference = async () => {
      try {
        setLoading(true);
        const conferenceId = searchParams.get('id');

        if (!conferenceId) {
          throw new Error("No conference ID provided");
        }

        // Fetch conference details
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
          {
            headers: session?.user?.token ? {
              Authorization: `Bearer ${session.user.token}`,
            } : {}
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conference details");
        }

        const data = await response.json();
        if (data.status === "success") {
          setConference(data.data);
          const { start_date, start_time } = data.data;
          const dateTimeString = `${start_date}T${start_time}`;
          setConferenceDate(new Date(dateTimeString));
        } else {
          throw new Error(data.message || "Failed to load conference details");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load conference details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConference();
  }, [session, searchParams]);

  const handleRegisterClick = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!conference) return;

    if (conference.is_registered) {
      router.push("/dashboard");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!conference || !session) return;

    setPaymentProcessing(true);
    try {
      // Initiate payment
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/conference/initiate_pay/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({
            id: conference.id,
            plan: selectedPlan
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const paymentData = await response.json();
      
      // Redirect to payment gateway or handle payment flow
      // This would depend on your payment provider integration
      // For Flutterwave, you would typically redirect to their payment page
      // or use their SDK to open a payment modal

      showToast.success("Payment initiated successfully");
      setShowPaymentModal(false);

      // In a real implementation, you would handle the payment callback
      // and verify payment with /confirm_payment/ endpoint

    } catch (err) {
      console.error("Payment error:", err);
      showToast.error("Failed to initiate payment");
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">Loading Conference...</h2>
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Conference Information</h2>
        <p className="text-white/70 max-w-md mb-6">{error}</p>
        <Button 
          className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
          onClick={() => window.location.href = '/'}
        >
          Back to Conferences
        </Button>
      </div>
    );
  }

  return (
    <div className="conference-bg min-h-screen pt-16 md:pt-24 px-4 md:px-8 lg:px-16 w-full pb-16">
      {/* Header with Countdown and Button */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full pt-8 md:pt-12 gap-6">
        <div className="w-full md:w-auto">
          {conferenceDate && <CountdownTimer targetDate={conferenceDate} />}
        </div>
        <Button 
          className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
          onClick={handleRegisterClick}
        >
          {!session ? (
            <span className="flex items-center gap-2">
              <LogIn className="w-5 h-5" /> Login to Register
            </span>
          ) : conference.is_registered ? (
            "Go to Dashboard"
          ) : (
            "Register Now"
          )}
        </Button>
      </div>
      
      {/* Hero Section */}
      <div className="mb-12 mt-8">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-6 leading-tight">
          {conference.theme}
        </h1>
        <div className="flex flex-wrap gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>{conference.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <MapPin className="w-5 h-5" />
            <span>{conference.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <span className={`px-2 py-1 text-xs rounded-full ${
              conference.status === "Completed" 
                ? "bg-red-100 text-red-800" 
                : conference.status === "Ongoing" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-blue-100 text-blue-800"
            }`}>
              {conference.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-16">
        {/* Overview Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sub-themes */}
            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Sub-themes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference.sub_theme.map((theme, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{theme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Workshops */}
            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference.work_shop.map((workshop, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{workshop}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          {/* Important Dates */}
          <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors mt-8">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {conference.important_date.map((date, index) => (
                  <div key={index} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg">
                    <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span>{date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Speakers Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Speakers
          </h2>
          
          {conference.speakers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {conference.speakers.map((speaker, index) => (
                <Card key={index} className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                      <img
                        src={speaker.picture}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{speaker.name}</h3>
                      <p className="text-[#D5B93C] text-sm mb-2">{speaker.title}</p>
                      <p className="text-white/70 text-sm">{speaker.portfolio}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-white/70">
              Speaker information will be available soon.
            </div>
          )}
        </section>

        {/* Flyer Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          Call for paper flyer
          </h2>
          <p className="text-white max-w-[60%]">We invite submissions for IAIIEA conference 2024. We seek innovative research and insights on a topic which aligns with the conference theme. Please submit your abstract by [deadline] to iaiiea2024@iaiiea.org. The paper should, specifically, address issues outlined in the associated sub-themes. 

</p>
<button  className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold p-3 rounded-md mt-3">Download flyer</button>
          
          {/* {conference.flyer ? (
            <div className="flex justify-center">
              <img 
                src={conference.flyer} 
                alt="Conference Flyer" 
                className="max-w-full h-auto rounded-lg shadow-lg border-2 border-white/20"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }} 
              />
            </div>
          ) : (
            <div className="text-center py-12 text-white/70">
              Flyer will be available soon.
            </div>
          )} */}
        </section>

        <div className="flex items-center justify-between">
        <div className="bg-[#F9F5E2]">
         <div>
            <h1>Conference Fees</h1>
          </div>
          <div>
           <p>Basic Access</p>
           <p>$29.99 </p>
           <p>N30,000 </p>
           <p>Includes: Conference materials, networking, some meals</p>
           <button  className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold p-3 rounded-md mt-3">Register</button>
          </div>
         </div>

          <div className="bg-[#DEE1ED]">
         <div>
            <h1>Conference Fees</h1>
          </div>
          <div>
           <p>Premium Access</p>
           <p>$29.99 </p>
           <p>N30,000 </p>
           <p>Includes: Conference materials, networking, some meals</p>
           <button  className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold p-3 rounded-md mt-3">Register</button>
          </div>
         </div>

          <div className="bg-[#F9F5E2]">
         <div>
            <h1>Conference Fees</h1>
          </div>
          <div>
           <p>Standard Access</p>
           <p>$29.99 </p>
           <p>N30,000 </p>
           <p>Includes: Conference materials, networking, some meals</p>
           <button  className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold p-3 rounded-md mt-3">Register</button>
          </div>
         </div> 
        </div>

        {/* Registration Section - Only show if logged in */}
        {session && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
              Registration Information
            </h2>
            
            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(conference.payments).map(
                    ([category, types], index) => (
                      <div key={index} className="border-b border-white/10 pb-6 last:border-0">
                        <h3 className="font-semibold text-lg capitalize text-[#D5B93C] mb-4">
                          {category.replace(/_/g, " ")}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-colors">
                            <div className="font-medium mb-2">Virtual</div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm opacity-80">USD</span>
                              <span className="font-bold">${types.virtual.usd}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm opacity-80">NGN</span>
                              <span className="font-bold">{types.virtual.naira}</span>
                            </div>
                          </div>
                          <div className="bg-white/10 p-4 rounded-lg hover:bg-white/15 transition-colors">
                            <div className="font-medium mb-2">Physical</div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm opacity-80">USD</span>
                              <span className="font-bold">${types.physical.usd}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-sm opacity-80">NGN</span>
                              <span className="font-bold">{types.physical.naira}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Select Payment Plan</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Plan</label>
                <Select value={selectedPlan} onValueChange={setSelectedPlan}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setShowPaymentModal(false)}
                  disabled={paymentProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
                  onClick={handlePaymentSubmit}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}