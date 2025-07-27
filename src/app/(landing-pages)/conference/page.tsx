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
  X,
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
  basic?: RegistrationType;
  standard?: RegistrationType;
  premium?: RegistrationType;
  early_bird_registration?: RegistrationType;
  normal_registration?: RegistrationType;
  late_registration?: RegistrationType;
  tour?: RegistrationType;
  annual_dues?: RegistrationType;
  vetting_fee?: RegistrationType;
  publication_fee?: RegistrationType;
  [key: string]: any;
}

interface Speaker {
  name: string;
  title: string;
  portfolio: string;
  picture: string;
}

interface Sponsor {
  name: string;
  logo: string;
  website?: string;
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
  sponsors: Sponsor[];
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

  if (images.length === 0) {
    return (
      <section className="my-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          Gallery
        </h2>
        <div className="bg-white/5 rounded-lg p-8 text-center">
          <p className="text-white/70">No gallery images available yet</p>
        </div>
      </section>
    );
  }

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
        <div className="relative h-64 md:h-96 w-full max-w-4xl mx-auto rounded-lg overflow-hidden">
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-300 bg-black"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.jpg";
            }}
          />
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
          ) }
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto py-2 justify-center">
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
  if (videos.length === 0) return <section className="my-12">
  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
   Video Ads
  </h2>
  <div className="bg-white/5 rounded-lg p-8 text-center">
    <p className="text-white/70">No Video Ads available yet</p>
  </div>
</section>;

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

const SponsorsSection = ({ sponsors }: { sponsors: Sponsor[] }) => {
  if (sponsors.length === 0) return <section className="my-12">
  <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
   Sponsors
  </h2>
  <div className="bg-white/5 rounded-lg p-8 text-center">
    <p className="text-white/70">No Sponsors available yet</p>
  </div>
</section>;
;

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Sponsors
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sponsors.map((sponsor, index) => (
          <div key={index} className="bg-white/5 rounded-lg p-6 flex items-center justify-center">
            <a 
              href={sponsor.website || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <img
                src={sponsor.logo}
                alt={sponsor.name}
                className="h-20 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
              <span className="text-white mt-2 text-center">{sponsor.name}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

const PaymentPlanCard = ({
  title,
  priceUsd,
  priceNaira,
  features,
  isCurrentPlan,
  isRegistered,
  isPopular = false,
  onClick,
  attendanceType,
}: {
  title: string;
  priceUsd: string;
  priceNaira: string;
  features: string[];
  isCurrentPlan: boolean;
  isRegistered: boolean;
  isPopular?: boolean;
  onClick: () => void;
  attendanceType: 'virtual' | 'physical';
}) => {
  return (
    <div className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
      isCurrentPlan ? 'border-[#D5B93C] ring-4 ring-[#D5B93C]/30' : isPopular ? 'border-[#D5B93C]' : 'border-[#D5B93C]/30'
    } ${isPopular ? 'transform md:-translate-y-2' : ''} relative`}>
      {isCurrentPlan && (
        <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
          ACTIVE ACCESS
        </div>
      )}
      <div className={`p-6 relative ${isCurrentPlan ? 'pt-16' : ''}`}>
        {/* {isPopular && !isRegistered && !isCurrentPlan && (
          <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
        )} */}
        <h3 className="text-xl font-bold text-[#0E1A3D] mb-4">{title}</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#0E1A3D]">
              ${priceUsd}
            </p>
            <p className="text-lg text-gray-700">
              {priceNaira}
            </p>
          </div>
          
          <div className="pt-2">
            <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              {features?.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {isRegistered ? (
            isCurrentPlan ? (
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
              onClick={onClick}
            >
              Register {title}
            </button>
          )}
        </div>
      </div>
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
  const [attendanceType, setAttendanceType] = useState<"virtual" | "physical">("virtual");

  useEffect(() => {
    const loadConference = async () => {
      try {
        setLoading(true);
        const conferenceId = searchParams.get("id");

        if (!conferenceId) {
          throw new Error("No conference ID provided");
        }
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

    if (conference.status === "Completed") {
      showToast.error("You cannot register for a conference that has been completed");
      return;
    }

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
    link.download = conference?.flyer.split('/').pop() || 'conference_flyer.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderPaymentPlans = () => {
    if (!conference) return null;
    if (conference?.payments?.early_bird_registration) {

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PaymentPlanCard
            title="Early Bird"
            priceUsd={conference?.payments?.early_bird_registration[attendanceType]?.usd || '0'}
            priceNaira={conference?.payments?.early_bird_registration[attendanceType]?.naira || '0'}
            features={conference?.payments?.early_bird_registration?.package}
            isCurrentPlan={conference?.is_registered && conference?.current_plan === 'early_bird_registration'}
            isRegistered={conference?.is_registered}
            isPopular
            onClick={() => {
              setSelectedPlan('early_bird_registration');
              handleRegisterClick();
            }}
            attendanceType={attendanceType}
          />

          {conference?.payments?.normal_registration && (
            <PaymentPlanCard
              title="Normal"
              priceUsd={conference?.payments?.normal_registration[attendanceType]?.usd || '0'}
              priceNaira={conference?.payments?.normal_registration[attendanceType]?.naira || '0'}
              features={conference?.payments?.normal_registration?.package}
              isCurrentPlan={conference?.is_registered && conference?.current_plan === 'normal_registration'}
              isRegistered={conference?.is_registered}
              onClick={() => {
                setSelectedPlan('normal_registration');
                handleRegisterClick();
              }}
              attendanceType={attendanceType}
            />
          )}

          {conference?.payments?.late_registration && (
            <PaymentPlanCard
              title="Late"
              priceUsd={conference?.payments?.late_registration[attendanceType]?.usd || '0'}
              priceNaira={conference?.payments?.late_registration[attendanceType]?.naira || '0'}
              features={conference?.payments?.late_registration?.package}
              isCurrentPlan={conference?.is_registered && conference?.current_plan === 'late_registration'}
              isRegistered={conference?.is_registered}
              onClick={() => {
                setSelectedPlan('late_registration');
                handleRegisterClick();
              }}
              attendanceType={attendanceType}
            />
          )}
        </div>
      );
    } else if (conference?.payments?.basic) {

      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PaymentPlanCard
            title="Basic"
            priceUsd={conference?.payments?.basic[attendanceType]?.usd || '0'}
            priceNaira={conference?.payments?.basic[attendanceType]?.naira || '0'}
            features={conference?.payments?.basic?.package}
            isCurrentPlan={conference?.is_registered && conference?.current_plan === 'basic'}
            isRegistered={conference?.is_registered}
            onClick={() => {
              setSelectedPlan('basic');
              handleRegisterClick();
            }}
            attendanceType={attendanceType}
          />

          {conference?.payments?.standard && (
            <PaymentPlanCard
              title="Standard"
              priceUsd={conference?.payments?.standard[attendanceType]?.usd || '0'}
              priceNaira={conference?.payments?.standard[attendanceType]?.naira || '0'}
              features={conference?.payments?.standard?.package}
              isCurrentPlan={conference.is_registered && conference.current_plan === 'standard'}
              isRegistered={conference.is_registered}
              isPopular
              onClick={() => {
                setSelectedPlan('standard');
                handleRegisterClick();
              }}
              attendanceType={attendanceType}
            />
          )}

          {conference?.payments?.premium && (
            <PaymentPlanCard
              title="Premium"
              priceUsd={conference?.payments?.premium[attendanceType]?.usd || '0'}
              priceNaira={conference?.payments?.premium[attendanceType]?.naira || '0'}
              features={conference?.payments?.premium?.package}
              isCurrentPlan={conference?.is_registered && conference?.current_plan === 'premium'}
              isRegistered={conference?.is_registered}
              onClick={() => {
                setSelectedPlan('premium');
                handleRegisterClick();
              }}
              attendanceType={attendanceType}
            />
          )}
        </div>
      );
    } else {

      return (
        <div className="text-white">
          <p>Registration information will be available soon.</p>
        </div>
      );
    }
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
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-7xl mx-auto pt-8 md:pt-12 gap-6">
        <div className="w-full md:w-auto">
          {conferenceDate && <CountdownTimer targetDate={conferenceDate} />}
        </div>
        {session ? (
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
        ) : (
          <Button
            className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
            onClick={() => router.push('/login')}
          >
            Sign in to Register
          </Button>
        )}
      </div>

      <div className="mb-12 mt-8 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-4 leading-tight text-center">
          {conference?.title}
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight text-center">
          {conference?.theme}
        </h2>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <Calendar className="w-5 h-5" />
            <span>{conference?.date}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <MapPin className="w-5 h-5" />
            <span>{conference?.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                conference?.status === "Completed"
                  ? "bg-red-100 text-red-800"
                  : conference?.status === "Ongoing"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {conference?.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-16 max-w-7xl mx-auto">

        <section>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Sub-themes</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference?.sub_theme.map((theme, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{theme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="text-[#D5B93C]">Workshops</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {conference?.work_shop.map((workshop, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{workshop}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border-none text-white hover:bg-white/10 transition-colors mt-8">
            <CardHeader>
              <CardTitle className="text-[#D5B93C]">Important Dates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                {conference?.important_date.map((date, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
                  >
                    <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                    <span className="text-lg">{date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
            Call for papers 
          </h2>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 md:p-8">
            <p className="text-white text-base md:text-lg leading-relaxed">
              We invite submissions for IAIIEA conference 2024. We seek innovative
              research and insights on a topic which aligns with the conference
              theme. Please <a href="https://journal.iaiiea.org/jiea/login?source=%2Fjiea%2Fissue%2Fview%2F1" className='underline font-bold text-[#D5B93C]'>submit</a> your abstract by [deadline] to
              iaiiea2024@iaiiea.org. The paper should, specifically, address
              issues outlined in the associated sub-themes.
            </p>
            <Button 
              className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold mt-6"
              onClick={downloadFlyer}
              disabled={!conference?.flyer}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Flyer
            </Button>
          </div>
        </section>

        <GalleryCarousel images={conference?.gallery} />

        <VideoAdsSection videos={conference?.videos} />

        <SponsorsSection sponsors={conference?.sponsors} />

        <div className="my-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 pb-2 border-b border-[#D5B93C] inline-block">
            Conference Fees
          </h2>

          {session && conference?.is_registered && conference?.current_plan && (
            <div className="mb-6 p-4 bg-[#D5B93C]/20 rounded-lg border border-[#D5B93C]">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#D5B93C] flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">You're registered for:</p>
                  <p className="text-white">
                    {conference.current_plan.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')} Access ({attendanceType})
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

          {renderPaymentPlans()}
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
                    {conference?.payments?.early_bird_registration && (
                      <SelectItem value="early_bird_registration">Early Bird</SelectItem>
                    )}
                    {conference?.payments?.normal_registration && (
                      <SelectItem value="normal_registration">Normal</SelectItem>
                    )}
                    {conference?.payments?.late_registration && (
                      <SelectItem value="late_registration">Late</SelectItem>
                    )}
                    {conference?.payments?.basic && (
                      <SelectItem value="basic">Basic</SelectItem>
                    )}
                    {conference?.payments?.standard && (
                      <SelectItem value="standard">Standard</SelectItem>
                    )}
                    {conference?.payments?.premium && (
                      <SelectItem value="premium">Premium</SelectItem>
                    )}
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