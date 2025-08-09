"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Clock,
  Book,
  Check,
  ChevronLeft,
  ChevronRight,
  User,
  LogIn,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast";
import '@/app/index.css';

interface PaymentTier {
  usd: string | number;
  naira: string | number;
}

interface RegistrationType {
  virtual?: PaymentTier;
  physical?: PaymentTier;
  package?: string[];
}

// Support both payment structures
interface SeminarPayments {
  basic?: RegistrationType;
  standard?: RegistrationType;
  premium?: RegistrationType;
  virtual?: PaymentTier;  // For free seminars
  physical?: PaymentTier; // For free seminars
  [key: string]: RegistrationType | PaymentTier | undefined;
}

interface Speaker {
  name: string | number;
  title: string | number;
  portfolio: string;
  picture: string;
}

interface SeminarDetails {
  id: number;
  is_registered: boolean;
  current_plan?: string;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[] | null;
  work_shop: string[] | null;
  speakers: Speaker[];
  payments: SeminarPayments;
  status: string;
  resources: any[];
  is_free?: string;
  mode?: string;
}


const getPaymentInfo = (payments: SeminarPayments, plan: string, attendanceType: 'virtual' | 'physical') => {
  if (payments[plan] && typeof payments[plan] === 'object' && 'virtual' in payments[plan]) {
    const planPayments = payments[plan] as RegistrationType;
    return planPayments[attendanceType];
  }
  
  // Check if it's the old structure with direct virtual/physical
  if (plan === 'basic' && payments.virtual && payments.physical) {
    return payments[attendanceType] as PaymentTier;
  }
  
  return null;
};

// Helper function to check if seminar has paid plans
const hasPaidPlans = (payments: SeminarPayments) => {
  return !!(payments.basic || payments.standard || payments.premium);
};

// Helper function to validate image URLs
const isValidImageUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string') return false;
  
  const trimmedUrl = url.trim();
  if (trimmedUrl === '') return false;
  
  // List of known invalid URLs
  // const invalidUrls = [
  //   'https://iaiiea.org/speakers/',
  //   'https://iaiiea.org/speakers/0',
  //   'https://iaiiea.org/speakers',
  //   '/placeholder.jpg',
  //   'placeholder.jpg'
  // ];
  
  // if (invalidUrls.includes(trimmedUrl)) return false;
  
  // Check if URL ends with just a slash (directory)
  if (trimmedUrl.endsWith('/')) return false;
  
  // Check if URL has a file extension
  const hasFileExtension = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmedUrl);
  if (!hasFileExtension) return false;
  
  // Check if it's a proper URL
  try {
    new URL(trimmedUrl);
    return true;
  } catch {
    return false;
  }
};

// Placeholder image data URL (1x1 transparent pixel)
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3ENo Image Available%3C/text%3E%3C/svg%3E";

// Dummy data for testing different scenarios
const getDummyData = (type: 'free' | 'paid' | 'error'): any => {
  if (type === 'error') {
    return null;
  }

  const baseData = {
    id: type === 'free' ? 206 : 204,
    is_registered: false,
    current_plan: null,
    title: type === 'free' ? "Free Digital Marketing Workshop" : "Advanced Investment Strategies Seminar 2025",
    theme: type === 'free' ? "Mastering Social Media Marketing" : "Building Wealth Through Smart Investments",
    venue: type === 'free' ? "Virtual Conference Room" : "Lagos Business Hub, Victoria Island",
    date: "March 15, 2025 To March 17, 2025",
    start_date: "2025-03-15",
    start_time: "10:00:00",
    sub_theme: type === 'free' ? [
      "Understanding Social Media Algorithms",
      "Content Creation Strategies",
      "Building Brand Awareness Online"
    ] : [
      "Portfolio Diversification Techniques",
      "Risk Management in Volatile Markets",
      "Emerging Investment Opportunities",
      "Tax-Efficient Investment Strategies"
    ],
    work_shop: type === 'free' ? [
      "Hands-on Instagram Marketing",
      "Facebook Ads Workshop",
      "LinkedIn for Business Growth"
    ] : [
      "Stock Analysis Workshop",
      "Real Estate Investment Planning",
      "Cryptocurrency Investment Basics"
    ],
    speakers: [
      {
        name: type === 'free' ? "Sarah Johnson" : "Dr. Michael Chen",
        title: type === 'free' ? "Digital Marketing Expert" : "Investment Strategist",
        portfolio: type === 'free' ? "Social Media Consultant with 10+ years experience" : "Former Goldman Sachs Analyst, Author of 'Smart Investing'",
        picture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: type === 'free' ? "Alex Rodriguez" : "Jennifer Williams",
        title: type === 'free' ? "Content Creator" : "Portfolio Manager",
        portfolio: type === 'free' ? "YouTube Creator with 2M+ subscribers" : "Managing Director at Wealth Management Firm",
        picture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: type === 'free' ? "Maria Garcia" : "Robert Thompson",
        title: type === 'free' ? "Brand Strategist" : "Financial Advisor",
        portfolio: type === 'free' ? "Brand consultant for Fortune 500 companies" : "Certified Financial Planner with 15+ years experience",
        picture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      }
    ],
    mode: type === 'free' ? "Virtual" : "Hybrid",
    is_free: type === 'free' ? "free" : "paid",
    status: "Upcoming",
    resources: [
      {
        resource_id: 1,
        resource_type: "PDF",
        caption: type === 'free' ? "Social Media Marketing Guide" : "Investment Planning Handbook",
        date: "2025-03-10",
        file: "https://example.com/sample.pdf"
      },
      {
        resource_id: 2,
        resource_type: "Video",
        caption: type === 'free' ? "Getting Started with Digital Marketing" : "Market Analysis Techniques",
        date: "2025-03-12",
        file: "https://example.com/sample-video.mp4"
      },
      {
        resource_id: 3,
        resource_type: "Docx",
        caption: type === 'free' ? "Content Calendar Template" : "Investment Portfolio Template",
        date: "2025-03-14",
        file: "https://example.com/template.docx"
      }
    ]
  };

  if (type === 'free') {
    return {
      ...baseData,
      payments: {
        virtual: { usd: 0, naira: 0 },
        physical: { usd: 0, naira: 0 }
      }
    };
  } else {
    return {
      ...baseData,
      payments: {
        basic: {
          virtual: { usd: "99", naira: "150000" },
          physical: { usd: "149", naira: "225000" },
          package: [
            "Digital seminar materials",
            "Certificate of completion",
            "Access to recorded sessions"
          ]
        },
        standard: {
          virtual: { usd: "199", naira: "300000" },
          physical: { usd: "299", naira: "450000" },
          package: [
            "Everything in Basic",
            "1-on-1 consultation session",
            "Premium resource pack",
            "Networking session access"
          ]
        },
        premium: {
          virtual: { usd: "399", naira: "600000" },
          physical: { usd: "599", naira: "900000" },
          package: [
            "Everything in Standard",
            "VIP networking dinner",
            "Personal investment review",
            "6-month follow-up support",
            "Exclusive masterclass access"
          ]
        }
      }
    };
  }
};

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
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
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
          <div
            key={unit}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[60px]"
          >
            <div className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
              {String(value).padStart(2, "0")}
            </div>
            <div className="text-white/80 text-xs md:text-sm capitalize">
              {unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Carousel = ({
  items,
  showArrows = true,
}: {
  items: string[];
  showArrows?: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-center">
        {showArrows && items?.length > 1 && (
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
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-[#D5B93C]/20 to-[#0E1A3D]/20 flex items-center justify-center">
              {(() => {
                const currentItem = items[currentIndex];
                const hasValidImage = isValidImageUrl(currentItem);
                
                if (hasValidImage) {
                  return (
                    <img
                      src={currentItem}
                      alt={`Item ${currentIndex + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.carousel-fallback');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }}
                    />
                  );
                }
                return null;
              })()}
              <div 
                className="carousel-fallback flex items-center justify-center w-full h-full text-white/50" 
                style={{ 
                  display: isValidImageUrl(items[currentIndex]) ? 'none' : 'flex'
                }}
              >
                <Book className="w-16 h-16" />
              </div>
            </div>
          ) : (
            <div className="text-white opacity-70 py-12">
              No items available
            </div>
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full transition-all ${
                idx === currentIndex ? "bg-[#D5B93C] w-4" : "bg-white/30"
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

export default function SeminarPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [seminar, setSeminar] = useState<SeminarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seminarDate, setSeminarDate] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [attendanceType, setAttendanceType] = useState<"virtual" | "physical">("virtual");

  useEffect(() => {
    const loadSeminar = async () => {
      try {
        setLoading(true);
        const seminarId = params.id;

        if (!seminarId) {
          throw new Error("No seminar ID provided");
        }

        // TESTING MODE - Toggle this for testing different scenarios
        const TESTING_MODE = false; // Set to false to use real API
        
        if (TESTING_MODE) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Test different scenarios based on seminar ID
          let dummyType: 'free' | 'paid' | 'error' = 'free';
          
          if (seminarId === 'free' || seminarId === '206') {
            dummyType = 'free';
          } else if (seminarId === 'paid' || seminarId === '204') {
            dummyType = 'paid';
          } else if (seminarId === 'error') {
            dummyType = 'error';
          } else {
            // Default to paid for other IDs
            dummyType = 'paid';
          }
          
          const dummyData = getDummyData(dummyType);
          
          if (dummyData) {
            setSeminar(dummyData);
            const { start_date, start_time } = dummyData;
            const dateTimeString = `${start_date}T${start_time}`;
            setSeminarDate(new Date(dateTimeString));
          } else {
            throw new Error("Seminar not found (testing error scenario)");
          }
        } else {
          // Real API call
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${seminarId}`,
            {
              headers: session?.user?.token
                ? {
                    Authorization: `Bearer ${session.user.token}`,
                  }
                : {},
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch seminar details");
          }

          const data = await response.json();
          if (data.status === "success") {
            setSeminar(data.data);
            const { start_date, start_time } = data.data;
            const dateTimeString = `${start_date}T${start_time}`;
            setSeminarDate(new Date(dateTimeString));
          } else {
            throw new Error(data.message || "Failed to load seminar details");
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load seminar details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadSeminar();
  }, [session, params]);

  const handleRegisterClick = async () => {
    if (!seminar) return;

    if (seminar?.is_registered) {
      router.push("/dashboard");
      return;
    }

    if (seminar?.is_free === "free" && !hasPaidPlans(seminar?.payments)) {
      if (!session) {
        showToast.error("Please login to register");
        return;
      }

      try {
        setPaymentProcessing(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/seminar/register_free/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.token}`,
            },
            body: JSON.stringify({
              id: seminar.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to register for free seminar");
        }

        const data = await response.json();
        if (data.status === "success") {
          showToast.success("Successfully registered for free seminar!");
          window.location.reload();
        } else {
          throw new Error(data.message || "Failed to register");
        }
      } catch (err) {
        showToast.error("Failed to register for seminar");
      } finally {
        setPaymentProcessing(false);
      }
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!seminar || !session) return;

    setPaymentProcessing(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seminar/initiate_pay/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.token}`,
          },
          body: JSON.stringify({
            id: seminar.id,
            plan: selectedPlan,
            type: attendanceType,
          }),
        }
      );

      const paymentData = await response.json();

      if (!response.ok) {
        throw new Error(paymentData.message || "Failed to initiate payment");
      }

      if (paymentData.status === "success" && paymentData.data.link) {
        // Redirect to payment gateway
        window.location.href = paymentData.data.link;
      } else {
        showToast.success("Payment initiated successfully");
        setShowPaymentModal(false);
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to process payment";
      console.log("Payment error:", errorMessage);
      showToast.error(errorMessage);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Loading Seminar...
        </h2>
      </div>
    );
  }

  if (error || !seminar) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Seminar Information
        </h2>
        <p className="text-white/70 max-w-md mb-6">{error}</p>
        <Button
          className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
          onClick={() => (window.location.href = "/")}
        >
          Back to Seminars
        </Button>
      </div>
    );
  }

  return (
    <div className="conference-bg min-h-screen pt-16 md:pt-24 px-4 md:px-8 lg:px-16 w-full pb-16">
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-8 md:pt-12 gap-6">
        <div className="w-full md:w-auto">
          {seminarDate && <CountdownTimer targetDate={seminarDate} />}
        </div>
        {/* Show register button based on seminar type */}
        {seminar?.is_free !== "free" && (
          <Button
            className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
            onClick={handleRegisterClick}
          >
            {seminar?.is_registered ? (
              "Go to Dashboard"
            ) : (
              "Register Now"
            )}
          </Button>
        )}
        {seminar?.is_free === "free" && (
          <div className="w-full md:w-auto text-center">
            <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3">
              <div className="text-green-400 font-bold text-lg">
                ✨ FREE SEMINAR ✨
              </div>
              <div className="text-white/80 text-sm mt-1">
                No registration required - Join us for free!
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-12 mt-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-4 leading-tight text-center">
          {seminar?.title}
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight text-center">
          {seminar?.theme}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>{seminar?.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <MapPin className="w-5 h-5" />
            <span>{seminar?.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                seminar?.status === "Completed"
                  ? "bg-red-100 text-red-800"
                  : seminar?.status === "Ongoing"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {seminar?.status}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-16 max-w-7xl mx-auto">
        {seminar?.sub_theme && seminar?.sub_theme?.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
              Overview
            </h2>

            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Sub-themes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {seminar?.sub_theme.map((theme, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{theme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {seminar?.work_shop && seminar?.work_shop?.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
              Workshops
            </h2>

            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {seminar?.work_shop?.map((workshop, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{workshop}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        )}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Speakers
          </h2>

          {seminar?.speakers?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seminar?.speakers?.map((speaker, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full bg-gradient-to-br from-[#D5B93C]/20 to-[#0E1A3D]/20 flex items-center justify-center">
                      {(() => {
                        const pictureUrl = speaker?.picture;
                        const hasValidImage = isValidImageUrl(pictureUrl);
                        
                        if (hasValidImage) {
                          return (
                            <div>
                              
                            </div>
                            // <img
                            //   src={pictureUrl}
                            //   alt={String(speaker?.name)}
                            //   className="w-full h-full object-cover"
                            //   onError={(e) => {
                            //     console.log('Image failed to load:', pictureUrl);
                            //     // Hide the image and show the fallback
                            //     e.currentTarget.style.display = 'none';
                            //     const fallback = e.currentTarget.parentElement?.querySelector('.speaker-fallback');
                            //     if (fallback) {
                            //       (fallback as HTMLElement).style.display = 'flex';
                            //     }
                            //   }}
                            // />
                          );
                        }
                        return null;
                      })()}
                      <div 
                        className="speaker-fallback flex items-center justify-center w-full h-full"
                        style={{ 
                          display: isValidImageUrl(speaker?.picture) ? 'none' : 'flex'
                        }}
                      >
                        <User className="w-16 h-16 text-[#D5B93C]/50" />
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{String(speaker?.name || 'Speaker')}</h3>
                      <p className="text-[#D5B93C] text-sm mb-2">
                        {String(speaker?.title || '')}
                      </p>
                      <p className="text-white/70 text-sm">
                        {speaker?.portfolio}
                      </p>
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

        {seminar?.is_free === "free" && (
          <section className="my-12">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
                {hasPaidPlans(seminar?.payments) ? "Free Access Available" : "Free Seminar"}
              </h2>
              <div className="bg-gradient-to-br from-green-500/20 to-[#D5B93C]/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 max-w-2xl mx-auto">
                <div className="text-5xl font-bold text-green-400 mb-4">100% FREE</div>
                <div className="text-white/90 mb-6 space-y-2">
                  <p className="text-lg font-medium">This seminar includes free access to:</p>
                  <div className="grid md:grid-cols-2 gap-2 mt-4">
                    <div className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>All seminar sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Digital materials</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Certificate of attendance</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                      <Check className="w-5 h-5 text-green-400" />
                      <span>Access to recordings</span>
                    </div>
                  </div>
                </div>
                
                {hasPaidPlans(seminar?.payments) && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-4">
                    <p className="text-yellow-300 text-sm font-medium">
                      💡 Optional paid upgrades available below for additional perks
                    </p>
                  </div>
                )}

                <div className="bg-green-500/20 text-green-300 font-bold py-3 px-4 rounded-md text-center flex items-center justify-center gap-2">
                  <Check className="w-5 h-5" />
                  <span>Free Access - No Payment Required!</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Seminar Fees Section - Show for paid seminars or free seminars with paid upgrades */}
        {(seminar?.is_free !== "free" || hasPaidPlans(seminar?.payments)) && (
          <div className="my-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pb-2 border-b border-[#D5B93C] inline-block">
              {seminar?.is_free === "free" ? "Optional Premium Upgrades" : "Seminar Fees"}
            </h2>
            {seminar?.is_free === "free" && (
              <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-300 text-center">
                  🎉 <strong>Remember:</strong> This seminar is completely FREE to attend! 
                  The options below are optional premium upgrades for additional perks.
                </p>
              </div>
            )}
            {seminar?.is_registered && seminar?.current_plan && (
              <div className="mb-6 p-4 bg-[#D5B93C]/20 rounded-lg border border-[#D5B93C]">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#D5B93C] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">You're registered for:</p>
                    <p className="text-white">
                      {seminar?.current_plan.charAt(0).toUpperCase() + seminar?.current_plan?.slice(1)} Access ({attendanceType})
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-1 rounded-full">
                <button 
                  className={`px-4 py-2 rounded-full ${attendanceType === 'virtual' ? 'bg-[#D5B93C] text-[#0E1A3D]' : 'text-white'} font-medium`}
                  onClick={() => setAttendanceType('virtual')}
                >
                  Virtual
                </button>
                <button 
                  className={`px-4 py-2 rounded-full ${attendanceType === 'physical' ? 'bg-[#D5B93C] text-[#0E1A3D]' : 'text-white'} font-medium`}
                  onClick={() => setAttendanceType('physical')}
                >
                  Physical
                </button>
              </div>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
              seminar?.is_registered && seminar?.current_plan === 'basic' ? 
              'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 'border-[#D5B93C]/30'
            } relative`}>
              {seminar?.is_registered && seminar?.current_plan === 'basic' && (
                <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
                  ACTIVE ACCESS
                </div>
              )}
              <div className={`p-6 ${seminar?.is_registered && seminar?.current_plan === 'basic' ? 'pt-16' : ''}`}>
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">
                  {seminar?.is_free === "free" ? "Basic Premium Add-ons" : "Basic Access"}
                </h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    {(() => {
                      const paymentInfo = getPaymentInfo(seminar?.payments, 'basic', attendanceType);
                      return paymentInfo ? (
                        <>
                          <p className="text-3xl font-bold text-[#0E1A3D]">
                            ${paymentInfo.usd}
                          </p>
                          <p className="text-lg text-gray-700">
                            ₦{paymentInfo.naira}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
                      );
                    })()}
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Seminar materials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'virtual' ? 'Virtual' : 'Physical'} access to sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Digital certificate</span>
                      </li>
                      {(() => {
                        const basicPlan = seminar?.payments?.basic as RegistrationType;
                        return basicPlan?.package?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>

                  {seminar?.is_registered ? (
                    seminar?.current_plan === 'basic' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Your Active Plan</span>
                      </div>
                    ) : (
                      <button 
                        className="w-full bg-gray-400 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 cursor-not-allowed"
                        disabled
                      >
                        Already Registered
                      </button>
                    )
                  ) : (
                    <button 
                      className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors"
                      onClick={() => {
                        setSelectedPlan('basic');
                        handleRegisterClick();
                      }}
                    >
{seminar?.is_free === "free" ? "Upgrade to Basic" : "Register Basic"}
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 transform md:-translate-y-2 ${
              seminar?.is_registered && seminar?.current_plan === 'standard' ? 
              'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 'border-[#D5B93C]'
            } relative`}>
              {seminar?.is_registered && seminar?.current_plan === 'standard' && (
                <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
                  ACTIVE ACCESS
                </div>
              )}
              <div className={`p-6 relative ${seminar?.is_registered && seminar?.current_plan === 'standard' ? 'pt-16' : ''}`}>
                {!seminar?.is_registered && (
                  <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Standard Access</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    {(() => {
                      const paymentInfo = getPaymentInfo(seminar?.payments, 'standard', attendanceType);
                      return paymentInfo ? (
                        <>
                          <p className="text-3xl font-bold text-[#0E1A3D]">
                            ${paymentInfo?.usd}
                          </p>
                          <p className="text-lg text-gray-700">
                            ₦{paymentInfo?.naira}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
                      );
                    })()}
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Everything in Basic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'virtual' ? 'Enhanced virtual experience' : 'Physical attendance'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'physical' ? 'Lunch & refreshments' : 'Exclusive virtual networking'}</span>
                      </li>
                      {(() => {
                        const standardPlan = seminar?.payments?.standard as RegistrationType;
                        return standardPlan?.package?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                  
                  {seminar?.is_registered ? (
                    seminar?.current_plan === 'standard' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Your Active Plan</span>
                      </div>
                    ) : (
                      <button 
                        className="w-full bg-gray-400 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 cursor-not-allowed"
                        disabled
                      >
                        Already Registered
                      </button>
                    )
                  ) : (
                    <button 
                      className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors"
                      onClick={() => {
                        setSelectedPlan('standard');
                        handleRegisterClick();
                      }}
                    >
{seminar?.is_free === "free" ? "Upgrade to Standard" : "Register Standard"}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
              seminar?.is_registered && seminar?.current_plan === 'premium' ? 
              'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : 'border-[#D5B93C]/30'
            } relative`}>
              {seminar?.is_registered && seminar?.current_plan === 'premium' && (
                <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
                  ACTIVE ACCESS
                </div>
              )}
              <div className={`p-6 ${seminar?.is_registered && seminar?.current_plan === 'premium' ? 'pt-16' : ''}`}>
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Premium Access</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    {(() => {
                      const paymentInfo = getPaymentInfo(seminar?.payments, 'premium', attendanceType);
                      return paymentInfo ? (
                        <>
                          <p className="text-3xl font-bold text-[#0E1A3D]">
                            ${paymentInfo?.usd}
                          </p>
                          <p className="text-lg text-gray-700">
                            ₦{paymentInfo?.naira}
                          </p>
                        </>
                      ) : (
                        <p className="text-2xl font-bold text-[#0E1A3D]">Free</p>
                      );
                    })()}
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Everything in Standard</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'virtual' ? 'VIP virtual lounge' : 'VIP seating'}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'virtual' ? 'One-on-one speaker sessions' : 'Networking dinner'}</span>
                      </li>
                      {(() => {
                        const premiumPlan = seminar?.payments?.premium as RegistrationType;
                        return premiumPlan?.package?.map((item, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                  
                  {seminar?.is_registered ? (
                    seminar?.current_plan === 'premium' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        <span>Your Active Plan</span>
                      </div>
                    ) : (
                      <button 
                        className="w-full bg-gray-400 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 cursor-not-allowed"
                        disabled
                      >
                        Already Registered
                      </button>
                    )
                  ) : (
                    <button 
                      className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors"
                      onClick={() => {
                        setSelectedPlan('premium');
                        handleRegisterClick();
                      }}
                    >
{seminar?.is_free === "free" ? "Upgrade to Premium" : "Register Premium"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          </div>
        )}

        {/* Resources Section */}
        {seminar?.resources && seminar.resources.length > 0 && (
          <section className="my-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
              Resources & Materials
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seminar.resources.map((resource, index) => (
                <Card
                  key={resource.resource_id || index}
                  className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {resource.resource_type === 'PDF' && (
                          <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {resource.resource_type === 'Video' && (
                          <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {resource.resource_type === 'Docx' && (
                          <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {!['PDF', 'Video', 'Docx'].includes(resource.resource_type) && (
                          <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                            <Download className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1 truncate">
                          {resource.caption}
                        </h3>
                        <p className="text-sm text-white/60 mb-2">
                          {resource.resource_type} • {resource.date}
                        </p>
                        
                        <Button
                          size="sm"
                          className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] text-xs"
                          onClick={() => {
                            if (resource.file) {
                              window.open(resource.file, '_blank');
                            }
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>

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

              <div>
                <label className="block text-sm font-medium mb-1">Attendance Type</label>
                <Select 
                  value={attendanceType} 
                  onValueChange={(value: "virtual" | "physical") => setAttendanceType(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select attendance type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
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