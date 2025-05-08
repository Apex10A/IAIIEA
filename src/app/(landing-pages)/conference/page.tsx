"use client";
import { useEffect, useState } from "react";
import "@/app/index.css";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { showToast } from "@/utils/toast";

interface PaymentTier {
  usd: string;
  naira: string;
}

interface RegistrationType {
  virtual: PaymentTier;
  physical: PaymentTier;
  package?: any[];
}

interface ConferencePayments {
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

interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  current_plan?: string;
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

const GalleryCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (images.length === 0) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Gallery
      </h2>
      
      <div className="relative group">
        {/* Main Image */}
        <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className=" h-full object-cover transition-opacity duration-300"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
        
        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden transition-all ${idx === currentIndex ? 'ring-2 ring-[#D5B93C]' : 'opacity-70 hover:opacity-100'}`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const VideoAdsSection = ({ videos }: { videos: string[] }) => {
  if (videos.length === 0) return null;

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Video Ads
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, index) => (
          <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
            <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
              <video
                controls
                className="absolute top-0 left-0 w-full h-full object-cover"
                poster="/video-poster.jpg"
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium">Promotional Video {index + 1}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
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
  const [attendanceType, setAttendanceType] = useState<"virtual" | "physical">("virtual");

  useEffect(() => {
    const loadConference = async () => {
      try {
        setLoading(true);
        const conferenceId = searchParams.get("id");

        if (!conferenceId) {
          throw new Error("No conference ID provided");
        }

        // Fetch conference details
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
          {
            headers: session?.user?.token
              ? {
                  Authorization: `Bearer ${session.user.token}`,
                }
              : {},
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
          err instanceof Error
            ? err.message
            : "Failed to load conference details"
        );
      } finally {
        setLoading(false);
      }
    };

    loadConference();
  }, [session, searchParams]);

  const handleRegisterClick = async () => {
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

  const downloadFlyer = () => {
    if (!conference?.flyer) return;
    
    const link = document.createElement('a');
    link.href = conference.flyer;
    link.download = conference.flyer.split('/').pop() || 'conference_flyer.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Loading Conference...
        </h2>
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen conference-bg p-8 text-center">
        <Book className="w-16 h-16 text-[#D5B93C] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          Conference Information
        </h2>
        <p className="text-white/70 max-w-md mb-6">{error}</p>
        <Button
          className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D]"
          onClick={() => (window.location.href = "/")}
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
          {conference.is_registered ? (
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
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                conference.status === "Completed"
                  ? "bg-red-100 text-red-800"
                  : conference.status === "Ongoing"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
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
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white/5 p-3 rounded-lg"
                  >
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
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors"
                >
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
                      <p className="text-[#D5B93C] text-sm mb-2">
                        {speaker.title}
                      </p>
                      <p className="text-white/70 text-sm">
                        {speaker.portfolio}
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

        {/* Flyer Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Call for papers 
          </h2>
          <p className="text-white max-w-[60%]">
            We invite submissions for IAIIEA conference 2024. We seek innovative
            research and insights on a topic which aligns with the conference
            theme. Please <a href="https://journal.iaiiea.org/jiea/login?source=%2Fjiea%2Fissue%2Fview%2F1" className='underline font-bold text-[#D5B93C]'>submit</a> your abstract by [deadline] to
            iaiiea2024@iaiiea.org. The paper should, specifically, address
            issues outlined in the associated sub-themes.
          </p>
          <Button 
            className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold mt-3"
            onClick={downloadFlyer}
            disabled={!conference.flyer}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Flyer
          </Button>
        </section>

        {/* Gallery Section */}
        <GalleryCarousel images={conference.gallery} />

        {/* Video Ads Section */}
        <VideoAdsSection videos={conference.videos} />

        {/* Conference Fees Section */}
        <div className="my-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pb-2 border-b border-[#D5B93C] inline-block">
            Conference Fees
          </h2>

          {/* Current Plan Indicator */}
          {conference.is_registered && conference.current_plan && (
            <div className="mb-6 p-4 bg-[#D5B93C]/20 rounded-lg border border-[#D5B93C]">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#D5B93C] flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">You're registered for:</p>
                  <p className="text-white">
                    {conference.current_plan.charAt(0).toUpperCase() + conference.current_plan.slice(1)} Access ({attendanceType})
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Type Toggle */}
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
            {/* Basic Access */}
            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
              conference.is_registered && conference.current_plan === 'basic' ? 
              'border-[#D5B93C]' : 'border-[#D5B93C]/30'
            }`}>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Basic Access</h3>
                
                <div className="space-y-4">
                  {/* <div className="text-center">
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${conference.payments.basic.virtual.usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {conference.payments.basic.virtual.naira}
                    </p>
                  </div> */}
                  
                  <div className="pt-2">
                    <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Conference materials</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'virtual' ? 'Virtual' : 'Physical'} access to sessions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Digital certificate</span>
                      </li>
                    </ul>
                  </div>
                  
                  {conference.is_registered ? (
                    conference.current_plan === 'basic' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center">
                        Your Current Plan
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

            {/* Standard Access */}
            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 transform md:-translate-y-2 ${
              conference.is_registered && conference.current_plan === 'standard' ? 
              'border-[#D5B93C]' : 'border-[#D5B93C]'
            }`}>
              <div className="p-6 relative">
                {!conference.is_registered && (
                  <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Standard Access</h3>
                
                <div className="space-y-4">
                  {/* <div className="text-center">
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${conference.payments.standard[attendanceType].usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {conference.payments.standard[attendanceType].naira}
                    </p>
                  </div> */}
                  
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
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>{attendanceType === 'physical' ? 'Printed materials' : 'Digital goodies'}</span>
                      </li>
                    </ul>
                  </div>
                  
                  {conference.is_registered ? (
                    conference.current_plan === 'standard' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center">
                        Your Current Plan
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

            {/* Premium Access */}
            <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
              conference.is_registered && conference.current_plan === 'premium' ? 
              'border-[#D5B93C]' : 'border-[#D5B93C]/30'
            }`}>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">Premium Access</h3>
                
                <div className="space-y-4">
                  {/* <div className="text-center">
                    <p className="text-3xl font-bold text-[#0E1A3D]">
                      ${conference.payments.premium[attendanceType].usd}
                    </p>
                    <p className="text-lg text-gray-700">
                      {conference.payments.premium[attendanceType].naira}
                    </p>
                  </div> */}
                  
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
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                        <span>Exclusive gifts</span>
                      </li>
                    </ul>
                  </div>
                  
                  {conference.is_registered ? (
                    conference.current_plan === 'premium' ? (
                      <div className="w-full bg-[#D5B93C] text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 text-center">
                        Your Current Plan
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