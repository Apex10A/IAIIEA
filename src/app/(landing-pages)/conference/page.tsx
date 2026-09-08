"use client";
import { useEffect, useState, useCallback, useMemo, memo } from "react";
import "@/app/index.css";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
import { showToast } from "@/utils/toast";
import ConferencePicker from "./ConferencePicker";
import { EventDescriptionAgendaSection } from "../components/EventDescriptionAgendaSection";
import {
  buildEventDateTime,
  formatEventScheduleDisplay,
} from "../utils/landingEventDates";
import {
  getPlanExplainer,
  getVisibleConferencePlans,
} from "./conferencePaymentUtils";
import { PaymentModal } from "./components/PaymentModal";
import { RegistrationPendingModal } from "../components/RegistrationPendingModal";
import { MEMBERS_DASHBOARD_URL } from "../utils/dashboardLinks";
import { EventPriceAmount } from "@/components/EventPriceAmount";
import { usePreferredEventCurrency, getCurrencyLabel } from "@/hooks/usePreferredEventCurrency";
import type { EventCurrency } from "@/utils/eventCurrency";

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
  description?: string;
  agenda?: string;
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
interface GalleryTpe {
  title: string;
  description: string;
}
// const gallery: GalleryType[]  {
//   { title: "Gallery", description: "A collection of images from past conferences." },
//   { title: "Videos", description: "Promotional videos and highlights from the conference." },
//   { title: "Sponsors", description: "Our esteemed sponsors who support the conference." },
// }

const CountdownTimer = memo(({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback(() => {
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
  }, [targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

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
});

CountdownTimer.displayName = "CountdownTimer";

const GalleryCarousel = memo(({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images?.length);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images?.length);
  }, [images.length]);

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
          {images?.length > 1 && (
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
        {images?.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto py-2 justify-center">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden transition-all ${
                  idx === currentIndex
                    ? "ring-2 ring-[#D5B93C]"
                    : "opacity-70 hover:opacity-100"
                }`}
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
});

GalleryCarousel.displayName = "GalleryCarousel";

const VideoAdsSection = memo(({ videos }: { videos: string[] }) => {
  if (videos.length === 0)
    return (
      <section className="my-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          Video Ads
        </h2>
        <div className="bg-white/5 rounded-lg p-8 text-center">
          <p className="text-white/70">No Video Ads available yet</p>
        </div>
      </section>
    );

  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Video Ads
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos?.map((video, index) => (
          <div key={index} className="bg-white/5 rounded-lg overflow-hidden">
            <div className="relative pt-[56.25%]">
              <video
                controls
                className="absolute top-0 left-0 w-full h-full object-cover"
                poster="/placeholder.jpg"
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium">
                Promotional Video {index + 1}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

const SponsorsSection = memo(({ sponsors }: { sponsors: Sponsor[] }) => {
  if (sponsors.length === 0)
    return (
      <section className="my-12">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
          Sponsors
        </h2>
        <div className="bg-white/5 rounded-lg p-8 text-center">
          <p className="text-white/70">No Sponsors available yet</p>
        </div>
      </section>
    );
  return (
    <section className="my-12">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-[#D5B93C] inline-block">
        Sponsors
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sponsors?.map((sponsor, index) => (
          <div
            key={index}
            className="bg-white/5 rounded-lg p-6 flex items-center justify-center"
          >
            <a
              href={sponsor?.website || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center"
            >
              <img
                src={sponsor?.logo || "/placeholder.jpg"}
                alt={sponsor?.name}
                className="h-20 object-contain"
                // onError={(e) => {
                //   e.currentTarget.src = "/placeholder.jpg";
                // }}
              />
              <span className="text-white mt-2 text-center">
                {sponsor?.name}
              </span>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
});

const PaymentPlanCard = memo(
  ({
    title,
    planDescription,
    priceUsd,
    priceNaira,
    features,
    isCurrentPlan,
    paymentProcessing,
    isRegistered,
    isPopular = false,
    onClick,
    signInRequired = false,
    onSignIn,
    displayCurrency,
  }: {
    title: string;
    planDescription?: string;
    priceUsd: string;
    priceNaira: string;
    features: string[];
    isCurrentPlan: boolean;
    paymentProcessing?: boolean;
    isRegistered: boolean;
    isPopular?: boolean;
    onClick: () => void;
    signInRequired?: boolean;
    onSignIn?: () => void;
    displayCurrency: EventCurrency;
  }) => {
    // const [localLoading, setLocalLoading] = useState(false);
    const isLoading = paymentProcessing;
    return (
      <div
        className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
          isCurrentPlan
            ? "border-[#D5B93C] ring-4 ring-[#D5B93C]/30"
            : isPopular
            ? "border-[#D5B93C]"
            : "border-[#D5B93C]/30"
        } ${isPopular ? "transform md:-translate-y-2" : ""} relative`}
      >
        {isCurrentPlan && (
          <div className="absolute top-0 left-0 right-0 bg-[#D5B93C] text-[#0E1A3D] py-2 text-center font-bold">
            ACTIVE ACCESS
          </div>
        )}
        <div className={`p-6 relative ${isCurrentPlan ? "pt-16" : ""}`}>
          {/* {isPopular && !isRegistered && !isCurrentPlan && (
          <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
        )} */}
          <h3 className="text-xl font-bold text-[#0E1A3D] mb-2">{title}</h3>
          {planDescription && (
            <p className="text-sm text-gray-600 mb-4">{planDescription}</p>
          )}

          <div className="space-y-4">
            <div className="text-center">
              <EventPriceAmount
                usd={priceUsd}
                naira={priceNaira}
                currency={displayCurrency}
              />
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
            ) : signInRequired ? (
              <button
                type="button"
                className="w-full bg-[#0E1A3D] hover:bg-[#0E1A3D]/90 text-white font-bold py-3 px-4 rounded-md mt-4 transition-colors flex items-center justify-center gap-2"
                onClick={onSignIn}
              >
                <LogIn className="w-4 h-4" />
                Sign in to register
              </button>
            ) : (
              <button
                className="w-full bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold py-3 px-4 rounded-md mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={async () => {
                  try {
                    await onClick();
                  } finally {
                  }
                }}
                disabled={isLoading}
              >
                 {isLoading ? "Processing..." : `Register — ${title}`}
                {/* {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  {isLoading ? "Processing..." : `Register — ${title}`}
                )} */}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default function ConferencePage() {
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get("id");

  if (!conferenceId) {
    return <ConferencePicker />;
  }

  return <ConferenceDetailPage />;
}

function ConferenceDetailPage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [conference, setConference] = useState<ConferenceDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conferenceDate, setConferenceDate] = useState<Date | null>(null);

  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPendingPaymentModal, setShowPendingPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [attendanceType, setAttendanceType] = useState<"virtual" | "physical">(
    "virtual"
  );
  const displayCurrency = usePreferredEventCurrency();

  const conferenceId = useMemo(() => searchParams.get("id"), [searchParams]);
  const authToken = useMemo(() => session?.user?.token, [session?.user?.token]);
  const loginCallback = useMemo(() => {
    const query = searchParams.toString();
    return encodeURIComponent(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  const goToLogin = useCallback(() => {
    router.push(`/login?callbackUrl=${loginCallback}`);
  }, [router, loginCallback]);

  const loadConference = useCallback(async () => {
    try {
      setLoading(true);

      if (!conferenceId) {
        throw new Error("No conference ID provided");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
        {
          headers: authToken
            ? {
                Authorization: `Bearer ${authToken}`,
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
        setConferenceDate(
          buildEventDateTime(data.data.start_date, data.data.start_time)
        );
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
  }, [conferenceId, authToken]);

  useEffect(() => {
    loadConference();
  }, [loadConference]);

  const handlePaymentSubmit = useCallback(
    async (planType: string) => {
      if (!conference || !session) {
        showToast.error("Please sign in to register for the conference");
        return;
      }

      if (conference.status === "Completed") {
        showToast.error(
          "You cannot register for a conference that has been completed"
        );
        return;
      }

      if (conference?.is_registered) {
        showToast.info("You are already registered for this conference");
        router.push(MEMBERS_DASHBOARD_URL);
        return;
      }

      if (!planType) {
        showToast.error("Please select a plan to register");
        return;
      }

      console.log("Setting paymentProcessing to true");
      setPaymentProcessing(true);

      // Add a minimum loading time to show the loading state
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        console.log("Making API call...");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/conference/initiate_pay/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.token}`,
            },
            body: JSON.stringify({
              id: conference?.id,
              plan: planType,
              type: attendanceType,
            }),
          }
        );

        console.log("API response status:", response.status);

        if (!response.ok) {
          console.log("API call failed with status:", response.status);
          throw new Error("Failed to initiate payment");
        }

        const paymentData = await response.json();
        console.log("Payment data received:", paymentData);

        if (paymentData?.status === "success" && paymentData?.data?.link) {
          console.log("Redirecting to payment gateway...");
          // Add a delay before redirect to show loading state
          await new Promise((resolve) => setTimeout(resolve, 500));
          // Redirect to payment gateway
          window.location.href = paymentData?.data?.link;
        } else {
          console.log("Payment initiated without redirect");
          await new Promise((resolve) => setTimeout(resolve, 300));
          setShowPaymentModal(false);
          setShowPendingPaymentModal(true);
        }
      } catch (err) {
        console.error("Payment error:", err);
        showToast.error("Failed to initiate payment");
      } finally {
        console.log("Setting paymentProcessing to false");
        setPaymentProcessing(false);
      }
    },
    [conference, session, attendanceType, router]
  );

  const downloadFlyer = useCallback(() => {
    if (!conference?.flyer) return;

    const link = document.createElement("a");
    link.href = conference.flyer;
    link.download =
      conference?.flyer.split("/").pop() || "conference_flyer.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [conference?.flyer]);

  const renderPaymentPlans = useMemo(() => {
    if (!conference) return null;

    const visiblePlans = getVisibleConferencePlans(
      conference.payments,
      attendanceType
    );

    if (!visiblePlans) {
      return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/80">
          <p>Registration fees for {attendanceType} attendance are not available yet.</p>
          <p className="text-sm text-white/60 mt-2">
            Try switching between virtual and physical, or check back later.
          </p>
        </div>
      );
    }

    return (
      <>
        <p className="text-white/80 text-sm md:text-base mb-6 max-w-3xl">
          {getPlanExplainer(visiblePlans.mode)}
        </p>
        <div
          className={`grid grid-cols-1 gap-6 ${
            visiblePlans.plans.length === 1
              ? 'max-w-md mx-auto'
              : visiblePlans.plans.length === 2
              ? 'md:grid-cols-2 max-w-4xl mx-auto'
              : 'md:grid-cols-3'
          }`}
        >
          {visiblePlans.plans.map((plan) => {
            const tier = conference.payments[plan.key];
            return (
              <PaymentPlanCard
                key={plan.key}
                title={plan.title}
                planDescription={plan.description}
                priceUsd={tier?.[attendanceType]?.usd || "0"}
                priceNaira={tier?.[attendanceType]?.naira || "0"}
                features={tier?.package || []}
                isCurrentPlan={
                  conference.is_registered && conference.current_plan === plan.key
                }
                paymentProcessing={paymentProcessing}
                isRegistered={conference.is_registered}
                isPopular={plan.isPopular}
                signInRequired={!session}
                onSignIn={goToLogin}
                displayCurrency={displayCurrency}
                onClick={() => {
                  setSelectedPlan(plan.key);
                  setShowPaymentModal(true);
                }}
              />
            );
          })}
        </div>
      </>
    );
  }, [
    conference,
    attendanceType,
    handlePaymentSubmit,
    paymentProcessing,
    session,
    goToLogin,
    displayCurrency,
  ]);

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
            onClick={() => {
              if (conference.is_registered) {
                router.push(MEMBERS_DASHBOARD_URL);
              } else {
                // Scroll to the Conference Fees section
                const feesSection = document.querySelector("#conference-fees");
                if (feesSection) {
                  feesSection.scrollIntoView({ behavior: "smooth" });
                }
              }
            }}
          >
            {conference.is_registered ? "Go to Dashboard" : "Register Now"}
          </Button>
        ) : (
          <Button
            className="w-full md:w-auto bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
            onClick={goToLogin}
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
            <span>
              {formatEventScheduleDisplay({
                date: conference?.date,
                startDate: conference?.start_date,
                startTime: conference?.start_time,
              })}
            </span>
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
        <EventDescriptionAgendaSection
          description={conference?.description}
          agenda={conference?.agenda}
          showAgenda={false}
        />

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
                {conference?.important_date.map((date, index) => {
                  // Clean up the date string by removing any leading numbers and spaces
                  const cleanDate = date.replace(/^\d+\s+\d+\s+\d+\s+/, '').trim();
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 bg-white/5 p-4 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                      <span className="text-lg">{cleanDate}</span>
                    </div>
                  );
                })}
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
              We invite submissions for {conference?.title}. We seek
              innovative research and insights on a topic which aligns with the
              conference theme. Please{" "}
              <a
                href="https://journal.iaiiea.org/jiea/login?source=%2Fjiea%2Fissue%2Fview%2F1"
                className="underline font-bold text-[#D5B93C]"
              >
                submit
              </a>{" "}
              your abstract by {(() => {
                const dates = conference?.important_date || [];
                const item = dates.find((d) => /Full Paper Documentation/i.test(d));
                const match = item?.match(/\b\d{4}-\d{2}-\d{2}\b/);
                return match?.[0] || "TBA";
              })()} to iaiiea2024@iaiiea.org. The paper
              should, specifically, address issues outlined in the associated
              sub-themes.
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

        <div id="conference-fees" className="my-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 pb-2 border-b border-[#D5B93C] inline-block">
            Conference Fees
          </h2>
          <p className="text-white/70 text-sm mb-8 max-w-2xl">
            Registration in three steps: choose how you will attend, pick a plan, then register. Payment is completed from your dashboard. Fees shown in {getCurrencyLabel(displayCurrency).toLowerCase()}.
          </p>

          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
            {[
              { step: 1, label: 'Choose attendance', active: true },
              { step: 2, label: 'Select a plan', active: true },
              {
                step: 3,
                label: conference?.is_registered
                  ? 'Registered'
                  : session
                  ? 'Register & pay in dashboard'
                  : 'Sign in & register',
                active: !!session || !!conference?.is_registered,
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-lg border px-4 py-3 text-sm ${
                  item.active
                    ? 'border-[#D5B93C] bg-[#D5B93C]/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                <span className="font-bold text-[#D5B93C] mr-2">{item.step}.</span>
                {item.label}
              </div>
            ))}
          </div>

          {session && conference?.is_registered && conference?.current_plan && (
            <div className="mb-6 p-4 bg-[#D5B93C]/20 rounded-lg border border-[#D5B93C]">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-[#D5B93C] flex-shrink-0" />
                <div>
                  <p className="font-bold text-white">You're registered for:</p>
                  <p className="text-white">
                    {conference.current_plan
                      .split("_")
                      .map(
                        (word) => word.charAt(0).toUpperCase() + word.slice(1)
                      )
                      .join(" ")}{" "}
                    Access ({attendanceType})
                  </p>
                </div>
              </div>
            </div>
          )}

          {!session && (
            <div className="mb-8 rounded-xl border border-[#D5B93C]/40 bg-[#D5B93C]/10 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <LogIn className="w-6 h-6 text-[#D5B93C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Sign in before you register</p>
                  <p className="text-sm text-white/70 mt-1">
                    Compare plans below, then sign in to register. You will complete payment from your dashboard under Pending Payments.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Button
                  className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#0E1A3D] font-bold"
                  onClick={goToLogin}
                >
                  Sign in
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  <Link href="/register">Create account</Link>
                </Button>
              </div>
            </div>
          )}

          {session && !conference?.is_registered && (
            <div className="mb-8 rounded-xl border border-white/20 bg-white/5 p-4 text-sm text-white/80">
              <strong className="text-white">How payment works:</strong> choosing a plan adds it to{" "}
              <strong>Pending Payments</strong> in your dashboard. You pay there to finish registration — not on this page.
            </div>
          )}

          <div className="flex justify-center mb-8">
            <div className="bg-white/10 p-1 rounded-full">
              <button
                className={`px-4 py-2 rounded-full ${
                  attendanceType === "virtual"
                    ? "bg-[#D5B93C] text-[#0E1A3D]"
                    : "text-white"
                } font-medium`}
                onClick={() => setAttendanceType("virtual")}
              >
                Virtual
              </button>
              <button
                className={`px-4 py-2 rounded-full ${
                  attendanceType === "physical"
                    ? "bg-[#D5B93C] text-[#0E1A3D]"
                    : "text-white"
                } font-medium`}
                onClick={() => setAttendanceType("physical")}
              >
                Physical
              </button>
            </div>
          </div>

          {renderPaymentPlans}
        </div>

        <EventDescriptionAgendaSection
          description={conference?.description}
          agenda={conference?.agenda}
          showDescription={false}
        />
      </div>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={() => handlePaymentSubmit(selectedPlan)}
        conference={conference}
        attendanceType={attendanceType}
        paymentProcessing={paymentProcessing}
        selectedPlan={selectedPlan}
        displayCurrency={displayCurrency}
      />

      <RegistrationPendingModal
        show={showPendingPaymentModal}
        onClose={() => setShowPendingPaymentModal(false)}
        eventTitle={conference?.title || "this conference"}
        planLabel={
          selectedPlan
            ? selectedPlan
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : undefined
        }
        attendanceType={attendanceType}
      />
    </div>
  );
}
