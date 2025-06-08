"use client"
import React from 'react';
import { MapPin, Calendar, Clock, Check, User } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import "@/app/index.css"

interface SeminarDetails {
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_time: string;
  speakers?: { name: string; title: string; picture: string; portfolio: string }[];
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
    return (
      <div className="min-h-screen flex items-center justify-center conference-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#D5B93C] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading seminar details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen conference-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto w-full pt-16 md:pt-24">
          <div className="text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#D5B93C] mb-4 leading-tight">
              {seminarDetails.title}
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8 leading-tight">
              {seminarDetails.theme}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>{seminarDetails.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>{seminarDetails.date}</span>
              </div>
              <div className="flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span>{seminarDetails.start_time}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      {seminarDetails.speakers && seminarDetails.speakers.length > 0 && (
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 pb-2 border-b border-[#D5B93C] inline-block">
              Featured Speakers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {seminarDetails.speakers.map((speaker, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/10 hover:bg-white/10 transition-colors">
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
                    <h3 className="text-xl font-bold text-white mb-1">{speaker.name}</h3>
                    <p className="text-[#D5B93C] text-sm mb-2">{speaker.title}</p>
                    <p className="text-white/70 text-sm">{speaker.portfolio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {seminarDetails.payments && Object.keys(seminarDetails.payments).length > 0 && (
        <section className="py-20 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 pb-2 border-b border-[#D5B93C] inline-block">
              Registration Packages
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(seminarDetails.payments).map(([tier, details], index) => (
                details && (
                  <div 
                    key={tier} 
                    className={`bg-[#F9F5E2] rounded-lg overflow-hidden shadow-lg border-2 ${
                      index === 1 ? 'border-[#D5B93C] transform md:-translate-y-2' : 'border-[#D5B93C]/30'
                    }`}
                  >
                    <div className="p-6 relative">
                      {index === 1 && (
                        <div className="absolute top-0 right-0 bg-[#D5B93C] text-[#0E1A3D] px-3 py-1 text-xs font-bold rounded-bl-lg">
                          POPULAR
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-[#0E1A3D] mb-4 capitalize">{tier}</h3>
                      
                      <div className="space-y-4">
                        {details.virtual && (
                          <div className="text-center">
                            <h4 className="text-lg font-semibold mb-2 text-[#0E1A3D]">Virtual</h4>
                            <p className="text-3xl font-bold text-[#0E1A3D]">
                              ${details.virtual.usd || '0'}
                            </p>
                            <p className="text-lg text-gray-700">
                              ₦{details.virtual.naira || '0'}
                            </p>
                          </div>
                        )}

                        {details.physical && (
                          <div className="text-center">
                            <h4 className="text-lg font-semibold mb-2 text-[#0E1A3D]">Physical</h4>
                            <p className="text-3xl font-bold text-[#0E1A3D]">
                              ${details.physical.usd || '0'}
                            </p>
                            <p className="text-lg text-gray-700">
                              ₦{details.physical.naira || '0'}
                            </p>
                          </div>
                        )}

                        {details.package && details.package.length > 0 && (
                          <div className="pt-2">
                            <h4 className="font-medium text-[#0E1A3D] mb-2">Includes:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {details.package.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Check className="w-4 h-4 text-[#D5B93C] mt-0.5 flex-shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
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