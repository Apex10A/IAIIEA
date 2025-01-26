"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from "next-auth/react";
import { MapPin, FileText, Images, Users, Video, DollarSign } from 'lucide-react';

// Import your page components
import VenueAndDatePage from '@/app/(landing-pages)/conference-landing-page/venue/page';
import SubThemesPage from '@/app/(landing-pages)/conference-landing-page/subtheme/page';
import CallForPapersPage from '@/app/(landing-pages)/conference-landing-page/paper-flyer/page';
import GalleryPage from '@/app/(landing-pages)/conference-landing-page/gallery/page';
import SponsorsPage from '@/app/(landing-pages)/conference-landing-page/sponsors/page';
import VideosPage from '@/app/(landing-pages)/conference-landing-page/videos/page';
import ConferenceFeesPage from '@/app/(landing-pages)/conference-landing-page/fees/page';
import { PaymentsStructure } from './fees/fees';
import RegistrationMessage from './message';

const ConferenceDetailsPage = () => {
  const [conferenceDetails, setConferenceDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('id');
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const pages = [
    { 
      component: (details: unknown) => <VenueAndDatePage details={details} />, 
      icon: <MapPin className="w-6 h-6" />,
      title: 'Venue & Date' 
    },
    { 
      component: (details: unknown) => <SubThemesPage details={details} />, 
      icon: <FileText className="w-6 h-6" />,
      title: 'Sub Themes' 
    },
    // { 
    //   component: (details: { flyer: string; }) => <CallForPapersPage flyer={details.flyer} />, 
    //   icon: <FileText className="w-6 h-6" />,
    //   title: 'Call for Papers' 
    // },
    // { 
    //   component: (details: { gallery: any; }) => <GalleryPage gallery={details.gallery} />, 
    //   icon: <Images className="w-6 h-6" />,
    //   title: 'Gallery' 
    // },
    { 
      component: (details: { sponsors: any; }) => <SponsorsPage sponsors={details.sponsors} />, 
      icon: <Users className="w-6 h-6" />,
      title: 'Sponsors' 
    },
    { 
      component: (details: { videos: any; }) => <VideosPage videos={details.videos} />, 
      icon: <Video className="w-6 h-6" />,
      title: 'Videos' 
    },
    // { 
    //   component: (details:  { payments: PaymentsStructure }) => <ConferenceFeesPage payments={details.payments} />, 
    //   icon: <DollarSign className="w-6 h-6" />,
    //   title: 'Conference Fees' 
    // }
  ];

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!conferenceId || !bearerToken) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`, 
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${bearerToken}` 
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch conference details');
        }

        const data = await response.json();
        
        if (data.status === "success") {
          setConferenceDetails(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch conference details');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [conferenceId, bearerToken]);

  if (isLoading) {
    return <div>Loading conference details...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!conferenceDetails) {
    return <div>No conference details found</div>;
  }

  // If not registered, show registration message
  if (!conferenceDetails.is_registered) {
    return (
      <RegistrationMessage 
        conferenceTitle={conferenceDetails.title} 
      />
    );
  }

  // If registered, show conference details with navigation
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-[#1A2A5C] text-white mt-20 flex flex-col items-center py-8 space-y-4">
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`p-3 rounded-lg ${currentPage === index ? 'bg-[#D5B93C] text-black' : 'hover:bg-blue-700'}`}
            title={page.title}
          >
            {page.icon}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 mt-20">
        {pages[currentPage].component(conferenceDetails)}
      </div>
    </div>
  );
};

export default ConferenceDetailsPage;