"use client";

import { useState } from "react";
import AdminDashboardGrid from "./DashboardGrid";
import { useSession } from "next-auth/react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import Events from '@/app/(admin)/admin-dashboard/events/page';
import BroadcastModal from "./BroadcastModal";
import DailySchedule from "./DailyShedule";
import Calendar from './calendar';
import DailyMeals from './DailyMeals';
import News from './News';
import ConferenceSchedule from "./DailyShedule";

// Define the type for dashboard items
interface DashboardItem {
  title: string;
  icon: "Calendar" | "Clock" | "Plus" | "Utensils" | "Newspaper" | "Settings" | "Upload" | "Megaphone";
  description: string;
  content: () => JSX.Element;
}

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);

  const dashboardItems: DashboardItem[] = [
    {
      title: "Annual Calendar",
      icon: "Calendar",
      description: "Manage and upload annual calendar",
      content: () => (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-600">Annual Calendar</h2>
          <Calendar />
        </div>
      )
    },
    {
      title: "Daily Conference Schedule",
      icon: "Clock",
      description: "Create and edit conference schedules",
      content: () => (
        <div className="flex items-center justify-between w-full ">
          <ConferenceSchedule/>
        </div>
      )
    },
    // {
    //   title: "Create Events",
    //   icon: "Plus",
    //   description: "Add new events to the platform",
    //   content: () => (
    //     <div>
    //       <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-600">Create Events</h2>
    //       <Events/>
    //     </div>
    //   )
    // },
    {
      title: "Daily Meals",
      icon: "Utensils",
      description: "Upload and update daily meal information",
      content: () => (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-600">Daily Meals</h2>
          <DailyMeals/>
        </div>
      )
    },
    {
      title: "News Management",
      icon: "Newspaper",
      description: "Post and manage news on main website",
      content: () => (
        <div>
          <News/>
        </div>
      )
    },
    {
      title: "Page Settings",
      icon: "Settings",
      description: "Modify website page configurations",
      content: () => (
        <div>
          <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-600">Page Settings</h2>
        </div>
      )
    },
    {
      title: "Broadcast message",
      icon: "Megaphone",
      description: "Broadcast a message to all users on the platform",
      content: () => (
        <div>
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-600">Broadcast message</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="max-w-[60%] opacity-[0.6]">
                  Broadcast a message to all users, members, conference particpants and speakers on the platform
                </p>
              </div>
              <div>
                <BroadcastModal/>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="px-6 py-10">
      <div className="pb-10">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-600">Admin Dashboard</h1>
        <h1 className="text-xl text-gray-600">Hi, {session?.user?.userData?.name || 'Faith'} 👋</h1>
      </div>

      {selectedItem ? (
        <div>
         <button 
  onClick={() => setSelectedItem(null)}
  className="group flex items-center gap-2 px-4 py-2 mb-6 bg-zinc-100 text-gray-700 hover:text-blue-700 transition-all duration-200 ease-in-out"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className="transform group-hover:-translate-x-1 transition-transform duration-200"
  >
    <path d="m15 18-6-6 6-6"/>
  </svg>
  <span className="font-medium">Back to Dashboard</span>
</button>
          {selectedItem.content()}
        </div>
      ) : (
        <AdminDashboardGrid
          items={dashboardItems.map(item => ({
            title: item.title,
            icon: item.icon,
            description: item.description,
            onClick: () => setSelectedItem(item)
          }))}
        />
      )}
    </div>
  );
}