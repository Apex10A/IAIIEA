'use client';

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { redirect } from 'next/navigation';
import "@/app/index.css"
// Components
import Sidebar from '@/app/(admin)/admin-dashboard/sidebarTwo/sidebar'
import DashboardHeader from '@/components/layout/header/DashboardHeader';

// Pages
import Dashboard from "@/app/(admin)/admin-dashboard/dashboard/page";
import Calendar from '@/app/(admin)/admin-dashboard/calendar/page';
import Announcement from '@/app/(admin)/admin-dashboard/announcement/page';
import ConferencePortal from '@/app/(members-dashboard)/members-dashboard/conference/page';
import SeminarsWebinars from "@/app/(members-dashboard)/members-dashboard/seminars/page";
import DailyMeals from '@/app/(admin)/admin-dashboard/dashboard/DailyMeals';
import MembersDirectory from '@/app/(admin)/admin-dashboard/membersdirectory/page';
import IAIIEAResources from '@/app/(admin)/admin-dashboard/resources/page';
import Gallery from '@/app/(admin)/admin-dashboard/gallery/page';
import Forum from "@/app/(admin)/admin-dashboard/forum/page";
import Payment from "@/app/(admin)/admin-dashboard/payment/Payment";
import Settings from '@/app/(members-dashboard)/members-dashboard/settings/page';
import Events from "@/app/(admin)/admin-dashboard/events/page"
import ConferenceParticpants from '@/app/(admin)/admin-dashboard/ConferenceParticipants/participants'
import  ConferenceResources  from '@/app/(admin)/admin-dashboard/conferences/page';
import SeminarParticipants from '@/app/(admin)/admin-dashboard/training/participants/page'
import SeminarResources from '@/app/(admin)/admin-dashboard/training/resources/page'
import MembersResorces from '@/app/(admin)/admin-dashboard/members-resources/page'
import News from '@/app/(admin)/admin-dashboard/dashboard/News';
import Messages from '@/app/(admin)/admin-dashboard/messages/page'
import Broadcast from '@/app/(admin)/admin-dashboard/broadcast/page'
import SpeakersList from '@/app/(admin)/admin-dashboard/speakers/page'
import LoadingDashboard from './LoadingDashboard';
import BroadcastModal from "@/app/(admin)/admin-dashboard/dashboard/BroadcastModal";
import DailySchedule from "@/app/(admin)/admin-dashboard/dashboard/DailyShedule";

// TypeScript interfaces
interface ComponentMap {
  [key: string]: JSX.Element;
}

export default function DashboardClient() {
  const [activeComponent, setActiveComponent] = useState<string>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/admin-login');
    },
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderComponent = (): JSX.Element => {
    const components: ComponentMap = {
      Dashboard: <Dashboard />,
      'Annual calendar': <Calendar/>,
      'Conference Schedule': <DailySchedule/>,
      'Daily Meals': <DailyMeals/>,
      'News': <News/>,
      'Broadcast Message': <BroadcastModal/>,
      'Speakers List': <SpeakersList/>,
      Announcement: <Announcement />,
      Payment: <Payment />,
      'Participants': <ConferenceParticpants/>,
      'Messages' : <Messages/>,
      'Broadcast' : <Broadcast/>,
      'Members Resources': <MembersResorces/>,
      'Gallery': <Gallery/>,
      'Conferences': <ConferenceResources/>,
      // 'Conference Portal': <ConferencePortal />,
      'Seminars / Webinars': <SeminarsWebinars />,
      'Directory': <MembersDirectory />,
      'resources': <IAIIEAResources />,
      'Events' : <Events/>,
      'Seminar Participants':  <SeminarParticipants/>,
      'Seminars':  <SeminarResources/>,
      // Gallery: <Gallery />,
      Forum: <Forum />,
      Settings: <Settings />,
    };
  
    // Ensure Dashboard is rendered if activeComponent is not in the map or is undefined
    return components[activeComponent] || components['Dashboard'];
  };
  // Loading state while checking session
  if (status === 'loading') {
    return (
     <LoadingDashboard/>
    );
  }

  // Render loading screen or redirect if session is unavailable
  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <p className="pt-3 font-medium text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <DashboardHeader isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-grow h-full">
        <button
          className="fixed left-4 top-20 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
          onClick={toggleSidebar}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isSidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div
          className={`fixed inset-y-0 left-0 transform pt-5 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30 md:z-0`}
        >
          <Sidebar setActiveComponent={setActiveComponent} hasPaid={true}/>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        <div className="flex-grow pt-40 md:pt-28 w-full overflow-y-auto bg-[#feffff] lg:px-6 px-3">
          <div className=" mx-auto">{renderComponent()}</div>
        </div>
      </div>
    </div>
  );
}