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
  usd: string;
  naira: string;
}

interface RegistrationType {
  virtual?: PaymentTier;
  physical?: PaymentTier;
  package?: string[];
}

interface SeminarPayments {
  basic: RegistrationType;
  standard: RegistrationType;
  premium: RegistrationType;
  [key: string]: RegistrationType;
}

interface Speaker {
  name: string;
  title: string;
  portfolio: string;
  picture: string;
}


// {
//     "status": "success",
//     "message": "Operation successful",
//     "data": {
//         "id": 206,
//         "is_registered": false,
//         "title": "jjsh",
//         "theme": "dddg",
//         "venue": "vdvd",
//         "date": "January 20, 2025 To February 03, 2026",
//         "start_date": "2025-01-20",
//         "start_time": "02:02:00",
//         "sub_theme": null,
//         "work_shop": null,
//         "speakers": [
//             {
//                 "name": 0,
//                 "title": 0,
//                 "portfolio": "Keynote Speaker",
//                 "picture": "https:\/\/iaiiea.org\/speakers\/0"
//             }
//         ],
//         "mode": "Physical",
//         "is_free": "free",
//         "payments": {
//             "virtual": {
//                 "usd": 0,
//                 "naira": 0
//             },
//             "physical": {
//                 "usd": 0,
//                 "naira": 0
//             }
//         },
//         "resources": [
//             {
//                 "resource_id": 24,
//                 "resource_type": "PDF",
//                 "caption": "contract",
//                 "date": "2025-02-03",
//                 "file": "https:\/\/iaiiea.org\/Resources\/685be28323696Contract Agreement - Praise Afolabi.pdf"
//             }
//         ]
//     }
// }

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
            <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
              {/* <img
                src={items[currentIndex]}
                alt={`Item ${currentIndex + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              /> */}
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

        // Fetch seminar details
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

    if (seminar.is_registered) {
      router.push("/dashboard");
      return;
    }

    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    if (!seminar || !session) return;

    setPaymentProcessing(true);
    try {
      // Initiate payment
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/seminar/initiate_pay/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify({
            id: seminar.id,
            plan: selectedPlan,
            type: attendanceType,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to initiate payment");
      }

      const paymentData = await response.json();

      if (paymentData.status === "success" && paymentData.data.link) {
        // Redirect to payment gateway
        window.location.href = paymentData.data.link;
      } else {
        showToast.success("Payment initiated successfully");
        setShowPaymentModal(false);
      }
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
      {/* Header with Countdown and Button */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-8 md:pt-12 gap-6">
        <div className="w-full md:w-auto">
          {seminarDate && <CountdownTimer targetDate={seminarDate} />}
        </div>
        <Button
          className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
          onClick={handleRegisterClick}
        >
          {seminar.is_registered ? (
            "Go to Dashboard"
          ) : (
            "Register Now"
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <div className="mb-12 mt-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-4 leading-tight text-center">
          {seminar.title}
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight text-center">
          {seminar.theme}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>{seminar.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <MapPin className="w-5 h-5" />
            <span>{seminar.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                seminar.status === "Completed"
                  ? "bg-red-100 text-red-800"
                  : seminar.status === "Ongoing"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {seminar.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-16 max-w-7xl mx-auto">
        {/* Overview Section */}
        {seminar.sub_theme && seminar.sub_theme.length > 0 && (
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
                  {seminar.sub_theme.map((theme, index) => (
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

        {/* Workshops */}
        {seminar.work_shop && seminar.work_shop.length > 0 && (
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
                  {seminar.work_shop.map((workshop, index) => (
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

        {/* Speakers Section */}
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
                    <div className="relative h-48 w-full">
                      {/* <img
                        src={speaker?.picture}
                        alt={speaker?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      /> */}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1">{speaker?.name}</h3>
                      <p className="text-[#D5B93C] text-sm mb-2">
                        {speaker?.title}
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

        <div className="my-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pb-2 border-b border-[#D5B93C] inline-block">
            Seminar Fees
          </h2>
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
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Basic Access</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${seminar?.payments?.basic[attendanceType]?.usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {seminar?.payments?.basic[attendanceType]?.naira}
                    </p>
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
                      {seminar?.payments?.basic?.package?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
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
                      Register Basic
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
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${seminar?.payments?.standard[attendanceType]?.usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {seminar?.payments?.standard[attendanceType]?.naira}
                    </p>
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
                      {seminar.payments.standard.package?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
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
                      Register Standard
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
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${seminar?.payments?.premium[attendanceType]?.usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {seminar?.payments?.premium[attendanceType]?.naira}
                    </p>
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
                      {seminar?.payments?.premium?.package?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
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
                      Register Premium
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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