"use client"
import React from 'react';
import { MapPin, Calendar, FileText, Images, Users, Video, DollarSign, Coffee } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import "@/app/index.css"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import Link from 'next/link';

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
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('id');
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  React.useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!conferenceId || !bearerToken) return;

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
      }
    };

    fetchConferenceDetails();
  }, [conferenceId, bearerToken]);

  if (!conferenceDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen conference-bg text-white flex items-center">
        <div className="container mx-auto px-6">
          <h1 className="text-6xl font-bold mb-4">{conferenceDetails.title}</h1>
          <p className="text-lg mb-8">{conferenceDetails.theme}</p>
          <div className="">
           <div className='flex items-center gap-3 '>
           <MapPin className="w-6 h-6" />
           <span className='text-lg'>{conferenceDetails.venue}</span>
           </div>
            <div className='flex items-center gap-3 '>
            <Calendar className="w-6 h-6" />
            <span className='text-lg'>{conferenceDetails.date}</span>
            </div>
          </div>
          <div>
            <Link href="/dashboard">
            <button className="bg-[#D5B93C] text-[#031a] py-2 px-6 mt-8 rounded-sm uppercase font-semibold">Access Portal</button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">About the Conference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-4">Sub Themes</h3>
              <ul className="space-y-2">
                {conferenceDetails.sub_theme.map((theme, index) => (
                  <li key={index} className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#D5B93C]" />
                    {theme}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">Workshops</h3>
              <ul className="space-y-2">
                {conferenceDetails.work_shop.map((workshop, index) => (
                  <li key={index} className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-[#D5B93C]" />
                    {workshop}
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
          <h2 className="text-4xl font-bold mb-12 text-center">Important Dates</h2>
          <div className="max-w-3xl mx-auto">
            {conferenceDetails.important_date.map((date, index) => (
              <div key={index} className="flex items-center mb-4 p-4 bg-gray-50 rounded-lg">
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
            <h2 className="text-4xl font-bold mb-12 text-center">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferenceDetails.gallery.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors */}
      {conferenceDetails.sponsors.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Our Sponsors</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {conferenceDetails.sponsors.map((sponsor, index) => (
                <img
                  key={index}
                  src={sponsor}
                  alt={`Sponsor ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              ))}
            </div>
          </div>
        </section>
      )}

       <section className="mt-12 container mx-auto px-6">
                <h2 className="text-2xl md:text-3xl font-bold text-[#000] mb-6 border-b border-[#D5B93C] pb-2">Registration Information</h2>
                <Card className="bg-white/5 backdrop-blur-sm border-none text-white">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {conferenceDetails && Object.entries(conferenceDetails.payments).map(
                        ([category, types], index) => (
                          <div key={index} className="border-b border-white/10  last:border-0">
                            <h3 className="font-semibold capitalize text-[#000]">
                              {category.replace(/_/g, " ")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="bg-white/10 p-3 rounded-md">
                                <div className="font-medium mb-1">Virtual</div>
                                <div className="flex justify-between border px-3 py-2 rounded-md">
                                  <span className="text-[#000] opacity-[0.6]">${types.virtual.usd}</span>
                                  <span className="text-[#000] opacity-[0.6]">NGN {types.virtual.naira}</span>
                                </div>
                              </div>
                              <div className="bg-white/10 p-3 rounded-md">
                                <div className="font-medium mb-1">Physical</div>
                                <div className="flex justify-between border px-3 py-2 rounded-md">
                                  <span className="text-[#000] opacity-[0.6]">${types.physical.usd}</span>
                                  <span className="text-[#000] opacity-[0.6]">NGN {types.physical.naira}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    
                    {/* <div className="flex justify-center mt-6">
                      <button className="bg-[#D5B93C] px-8 py-3 font-bold uppercase text-[#0E1A3D] rounded-md">
                        Register Now
                      </button>
                    </div> */}
                  </CardContent>
                </Card>
              </section>
          
      

      {/* Meals */}
      {conferenceDetails.meals.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Meals & Refreshments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conferenceDetails.meals.map((meal, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                  <Coffee className="w-8 h-8 mb-4 text-[#D5B93C]" />
                  <h3 className="text-xl font-semibold mb-2">{meal.name}</h3>
                  {meal.image && (
                    <img
                      src={meal.image}
                      alt={meal.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ConferenceLandingPage;