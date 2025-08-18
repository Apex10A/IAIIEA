"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Book, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { showToast } from "@/utils/toast";
import '@/app/index.css';

// Import components
import { CountdownTimer } from "./components/CountdownTimer";
import { SpeakersSection } from "./components/SpeakersSection";
import { ResourcesSection } from "./components/ResourcesSection";
import { PaymentModal } from "./components/PaymentModal";
import { PricingSection } from "./components/PricingSection";
import { FreeSeminarSection } from "./components/FreeSeminarSection";
import { OverviewSection } from "./components/OverviewSection";

// Import types and utilities
import { SeminarDetails, RegistrationType } from "./types";
import { getPaymentInfo, hasPaidPlans } from "./utils";
import { getDummyData } from "./dummyData";

export default function SeminarPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [seminar, setSeminar] = useState<SeminarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seminarDate, setSeminarDate] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("basic"); // Keep for legacy support
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
      // Check if it's a free seminar
      const fee = attendanceType === 'virtual' 
        ? { naira: seminar?.payments?.virtual_fee_naira || 0, usd: seminar?.payments?.virtual_fee_usd || 0 }
        : { naira: seminar?.payments?.physical_fee_naira || 0, usd: seminar?.payments?.physical_fee_usd || 0 };
      
      const isFree = Number(fee.usd) === 0 && Number(fee.naira) === 0;

      if (isFree) {
        // Handle free registration
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
              type: attendanceType,
            }),
          }
        );

        const data = await response.json();
        if (data.status === "success") {
          showToast.success("Successfully registered for seminar!");
          setShowPaymentModal(false);
          window.location.reload();
        } else {
          throw new Error(data.message || "Failed to register");
        }
      } else {
        // Handle paid registration
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
              type: attendanceType,
              // Keep legacy support for now
              plan: selectedPlan,
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
        <OverviewSection 
          subThemes={seminar?.sub_theme} 
          workshops={seminar?.work_shop} 
        />
        <SpeakersSection speakers={seminar?.speakers || []} />

        {/* {seminar && <FreeSeminarSection seminar={seminar} />} */}

        {seminar && (
          <PricingSection
            seminar={seminar}
            attendanceType={attendanceType}
            selectedPlan={selectedPlan}
            onRegisterClick={handleRegisterClick}
            onPlanSelect={setSelectedPlan}
            onAttendanceTypeChange={setAttendanceType}
          />
        )}

        <ResourcesSection resources={seminar?.resources || []} />
      </div>

      <PaymentModal
        show={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentSubmit}
        seminar={seminar}
        attendanceType={attendanceType}
        paymentProcessing={paymentProcessing}
      />
    </div>
  );
}