"use client"
import React from 'react';
import { MapPin, Calendar, FileText, Images, Users, Video, DollarSign, Coffee, Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import "@/app/index.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";

const ConferenceLandingPage = () => {
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

  interface ConferenceDetails {
    title: string;
    theme: string;
    venue: string;
    date: string;
    sub_theme: string[];
    work_shop: string[];
    payments: ConferencePayments;
    important_date: string[];
    gallery: string[];
    sponsors: string[];
    meals: { name: string; image?: string }[];
  }

  const [conferenceDetails, setConferenceDetails] = React.useState<ConferenceDetails | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('id');
  const { data: session, status } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  React.useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!conferenceId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          setConferenceDetails(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch conference details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (bearerToken) {
      fetchConferenceDetails();
    } else {
      setIsLoading(false);
    }
  }, [conferenceId, bearerToken]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!bearerToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Authentication Required</h1>
          <p className="text-muted-foreground">
            Please sign in to view this conference details.
          </p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Conference Not Found</h1>
          <p className="text-muted-foreground">
            The requested conference could not be loaded. Please try again later.
          </p>
          <Button asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen conference-bg text-white flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{conferenceDetails.title}</h1>
          <p className="text-lg mb-8 max-w-2xl">{conferenceDetails.theme}</p>
          <div className="space-y-2">
            <div className='flex items-center gap-3'>
              <MapPin className="w-6 h-6" />
              <span className='text-lg'>{conferenceDetails.venue}</span>
            </div>
            <div className='flex items-center gap-3'>
              <Calendar className="w-6 h-6" />
              <span className='text-lg'>{conferenceDetails.date}</span>
            </div>
          </div>
          <div className="mt-8">
            <Link href="/dashboard">
              <Button className="bg-[#D5B93C] hover:bg-[#D5B93C]/90 text-[#031a] py-2 px-6 rounded-sm uppercase font-semibold">
                Access Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">About the Conference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Sub Themes</h3>
              <ul className="space-y-3">
                {conferenceDetails.sub_theme.map((theme, index) => (
                  <li key={index} className="flex items-start">
                    <FileText className="w-5 h-5 mt-0.5 mr-2 text-[#D5B93C]" />
                    <span>{theme}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Workshops</h3>
              <ul className="space-y-3">
                {conferenceDetails.work_shop.map((workshop, index) => (
                  <li key={index} className="flex items-start">
                    <Users className="w-5 h-5 mt-0.5 mr-2 text-[#D5B93C]" />
                    <span>{workshop}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Important Dates</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {conferenceDetails.important_date.map((date, index) => (
              <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-6 h-6 mr-4 text-[#D5B93C]" />
                <span>{date}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {conferenceDetails.gallery.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {conferenceDetails.gallery.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-lg">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors */}
      {conferenceDetails.sponsors.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Sponsors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {conferenceDetails.sponsors.map((sponsor, index) => (
                <div key={index} className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm">
                  <img
                    src={sponsor}
                    alt={`Sponsor ${index + 1}`}
                    className="max-h-20 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Registration */}
      <section className="mt-12 container mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#000] mb-6 border-b border-[#D5B93C] pb-2">
          Registration Information
        </h2>
        <Card className="bg-white border">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {conferenceDetails && Object.entries(conferenceDetails.payments).map(
                ([category, types], index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                    <h3 className="font-semibold capitalize text-[#000] mb-4">
                      {category.replace(/_/g, " ")}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="font-medium mb-2">Virtual</div>
                        <div className="flex justify-between bg-white px-4 py-3 rounded-md border">
                          <span className="text-[#000]">${types.virtual.usd}</span>
                          <span className="text-[#000]">NGN {types.virtual.naira}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="font-medium mb-2">Physical</div>
                        <div className="flex justify-between bg-white px-4 py-3 rounded-md border">
                          <span className="text-[#000]">${types.physical.usd}</span>
                          <span className="text-[#000]">NGN {types.physical.naira}</span>
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

      {/* Meals */}
      {conferenceDetails.meals.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Meals & Refreshments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferenceDetails.meals.map((meal, index) => (
                <Card key={index} className="overflow-hidden">
                  {meal.image && (
                    <div className="relative h-48">
                      <img
                        src={meal.image}
                        alt={meal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center">
                      <Coffee className="w-6 h-6 mr-2 text-[#D5B93C]" />
                      <h3 className="text-lg font-semibold">{meal.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ConferenceLandingPage;