'use client';
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
import Script from "next/script";

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
  const [selectedPlan, setSelectedPlan] = useState<keyof ConferencePayments>("normal_registration");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadConference = async () => {
      try {
        setLoading(true);
        const conferenceId = searchParams.get('id');

        if (!conferenceId) {
          throw new Error("No conference ID provided");
        }

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
          
          // Check if user is registered and get their plan
          if (data.data.is_registered) {
            // This would come from your API - you might need to modify your endpoint
            // to return the specific plan the user registered for
            setUserPlan("normal_registration"); // Default to normal if not specified
          }
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
      // Get the selected payment tier
      const paymentTier = conference.payments[selectedPlan];
      const amount = parseFloat(paymentTier.physical.usd); // Using physical as default

      // Initiate payment with the backend
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

      // Configure Flutterwave
      const config = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '',
        tx_ref: `${paymentData.payment_id}-${Date.now()}`,
        amount: amount,
        currency: 'USD',
        customer: {
          email: session.user.email || '',
          name: session.user.name || 'Conference Attendee',
          phone_number: '', // Add if you have user's phone number
        },
        customizations: {
          title: `IAIIEA Conference ${selectedPlan.replace(/_/g, ' ')}`,
          description: `Payment for ${selectedPlan.replace(/_/g, ' ')} access to IAIIEA Conference`,
          logo: '/logo.png',
        },
        payment_options: 'card, banktransfer, ussd',
      };

      // Initialize Flutterwave payment
      if (typeof window !== 'undefined' && window.FlutterwaveCheckout) {
        window.FlutterwaveCheckout({
          ...config,
          callback: async (response) => {
            // Verify payment with your backend
            const verifyResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/confirm_payment/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.user.token}`,
                },
                body: JSON.stringify({
                  payment_id: paymentData.payment_id,
                  processor_id: response.transaction_id,
                  paid: amount
                })
              }
            );

            if (verifyResponse.ok) {
              showToast.success("Payment confirmed successfully");
              setUserPlan(selectedPlan);
              // Refresh conference data to show registration status
              const updatedResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conference.id}`,
                {
                  headers: {
                    Authorization: `Bearer ${session.user.token}`,
                  }
                }
              );
              const updatedData = await updatedResponse.json();
              setConference(updatedData.data);
            } else {
              showToast.error("Payment verification failed");
            }
          },
          onclose: () => {
            showToast.info("Payment window closed");
          }
        });
      } else {
        throw new Error("Flutterwave not available");
      }

    } catch (err) {
      console.error("Payment error:", err);
      showToast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaymentProcessing(false);
      setShowPaymentModal(false);
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

  // Get the payment tiers from the conference data
  const { early_bird_registration, normal_registration, late_registration } = conference.payments;

  return (
    <div className="conference-bg min-h-screen pt-16 md:pt-24 px-4 md:px-8 lg:px-16 w-full pb-16">
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="beforeInteractive"
      />
      
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
        {/* Conference Fee Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Conference Fee
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Early Bird Registration */}
            <div className={`bg-white/5 backdrop-blur-sm rounded-lg p-6 border transition-colors ${
              userPlan === "early_bird_registration" 
                ? "border-[#D5B93C]" 
                : "border-white/10 hover:border-[#D5B93C]"
            }`}>
              <h3 className="text-xl font-bold text-[#D5B93C] mb-2">Early Bird Access</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-white">${early_bird_registration.physical.usd}</span>
                <span className="text-white/80 mb-1">≈ ₦{early_bird_registration.physical.naira}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Conference materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Networking opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Some meals included</span>
                </li>
              </ul>
              {userPlan === "early_bird_registration" ? (
                <div className="text-center py-2 px-4 bg-green-900/30 text-green-400 rounded">
                  You're registered for this plan
                </div>
              ) : conference.is_registered ? (
                <div className="text-center py-2 px-4 bg-yellow-900/30 text-yellow-400 rounded">
                  Already registered for another plan
                </div>
              ) : (
                <Button 
                  className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
                  onClick={() => {
                    setSelectedPlan("early_bird_registration");
                    handlePaymentSubmit();
                  }}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? "Processing..." : "Initiate Payment"}
                </Button>
              )}
            </div>

            {/* Normal Registration (Premium) */}
            <div className={`bg-white/5 backdrop-blur-sm rounded-lg p-6 border transition-colors relative ${
              userPlan === "normal_registration" 
                ? "border-[#D5B93C]" 
                : "border-white/10 hover:border-[#D5B93C]"
            }`}>
              <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>
              <h3 className="text-xl font-bold text-[#D5B93C] mb-2">Standard Access</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-white">${normal_registration.physical.usd}</span>
                <span className="text-white/80 mb-1">≈ ₦{normal_registration.physical.naira}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>All Early Bird benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>All meals included</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Conference workshop</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Excursion activities</span>
                </li>
              </ul>
              {userPlan === "normal_registration" ? (
                <div className="text-center py-2 px-4 bg-green-900/30 text-green-400 rounded">
                  You're registered for this plan
                </div>
              ) : conference.is_registered ? (
                <div className="text-center py-2 px-4 bg-yellow-900/30 text-yellow-400 rounded">
                  Already registered for another plan
                </div>
              ) : (
                <Button 
                  className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
                  onClick={() => {
                    setSelectedPlan("normal_registration");
                    handlePaymentSubmit();
                  }}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? "Processing..." : "Initiate Payment"}
                </Button>
              )}
            </div>

            {/* Late Registration */}
            <div className={`bg-white/5 backdrop-blur-sm rounded-lg p-6 border transition-colors ${
              userPlan === "late_registration" 
                ? "border-[#D5B93C]" 
                : "border-white/10 hover:border-[#D5B93C]"
            }`}>
              <h3 className="text-xl font-bold text-[#D5B93C] mb-2">Late Registration</h3>
              <div className="flex items-end gap-2 mb-4">
                <span className="text-3xl font-bold text-white">${late_registration.physical.usd}</span>
                <span className="text-white/80 mb-1">≈ ₦{late_registration.physical.naira}</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>All Standard benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>Priority seating</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>VIP networking</span>
                </li>
              </ul>
              {userPlan === "late_registration" ? (
                <div className="text-center py-2 px-4 bg-green-900/30 text-green-400 rounded">
                  You're registered for this plan
                </div>
              ) : conference.is_registered ? (
                <div className="text-center py-2 px-4 bg-yellow-900/30 text-yellow-400 rounded">
                  Already registered for another plan
                </div>
              ) : (
                <Button 
                  className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
                  onClick={() => {
                    setSelectedPlan("late_registration");
                    handlePaymentSubmit();
                  }}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? "Processing..." : "Initiate Payment"}
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Rest of your existing sections... */}
      </div>
    </div>
  );
}