"use client"
import React from 'react';
import { MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import "@/app/index.css"

interface SeminarDetails {
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_time: string;
  speakers?: { name: string; title: string; picture: string }[];
  payments?: {
    [key: string]: {
      virtual?: { usd?: number; naira?: number };
      physical?: { usd?: number; naira?: number };
      package?: string[];
    };
  };
}

const SeminarLandingPage = () => {
  const [seminarDetails, setSeminarDetails] = React.useState<SeminarDetails | null>(null);
  const searchParams = useSearchParams();
  const seminarId = searchParams.get('id');

  React.useEffect(() => {
    const fetchSeminarDetails = async () => {
      if (!seminarId) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${seminarId}`
        );
        const data = await response.json();
        if (data.status === "success") {
          setSeminarDetails(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch seminar details:', error);
      }
    };

    fetchSeminarDetails();
  }, [seminarId]);

  if (!seminarDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Background */}
      <section className="relative h-screen">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 bg-[#1A2A5C] bg-opacity-90">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-30" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-white px-6">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold mb-6">{seminarDetails.title}</h1>
            <p className="text-xl md:text-2xl mb-8">
              <span className="text-[#D5B93C]">Theme: </span>
              {seminarDetails.theme}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <div className="flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-[#D5B93C]" />
                <span>{seminarDetails.venue}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-[#D5B93C]" />
                <span>{seminarDetails.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-6 h-6 mr-2 text-[#D5B93C]" />
                <span>{seminarDetails.start_time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      {seminarDetails.speakers && seminarDetails.speakers.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Featured Speakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {seminarDetails.speakers.map((speaker, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative h-64 w-full">
                    <img
                      src={speaker.picture}
                      alt={speaker.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{speaker.name}</h3>
                    <p className="text-gray-600">{speaker.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {seminarDetails.payments && Object.keys(seminarDetails.payments).length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold mb-12 text-center">Registration Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Object.entries(seminarDetails.payments).map(([tier, details]) => (
                details && (
                  <div key={tier} className="bg-white rounded-lg shadow-lg p-8">
                    <h3 className="text-2xl font-semibold mb-4 capitalize">{tier}</h3>
                    
                    {details.virtual && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Virtual</h4>
                        <p className="text-[#D5B93C] font-bold">
                          {details.virtual.usd && `USD $${details.virtual.usd}`}
                          {details.virtual.usd && details.virtual.naira && ' / '}
                          {details.virtual.naira && `₦${details.virtual.naira}`}
                        </p>
                      </div>
                    )}

                    {details.physical && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-2">Physical</h4>
                        <p className="text-[#D5B93C] font-bold">
                          {details.physical.usd && `USD $${details.physical.usd}`}
                          {details.physical.usd && details.physical.naira && ' / '}
                          {details.physical.naira && `₦${details.physical.naira}`}
                        </p>
                      </div>
                    )}

                    {details.package && details.package.length > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Includes:</h4>
                        <ul className="space-y-2">
                          {details.package.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-2 text-[#D5B93C]" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SeminarLandingPage;