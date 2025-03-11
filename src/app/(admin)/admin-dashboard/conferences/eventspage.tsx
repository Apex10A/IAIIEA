import React, {useState} from 'react'
import {ConferenceDetails} from '@/app/(admin)/admin-dashboard/conferences/events'


interface Conference {
    id: number;
    title: string;
    theme: string;
    venue: string;
    date: string;
    start_date: string;
    start_time: string;
    sub_theme: string[];
    work_shop: string[];
    important_date: string[];
    status: string;
    gallery: string[];
    flyer: string;
    sponsors: string[];
    videos: string[];
    // resources: Resource[];
    // schedule: Schedule[];
    // meals: Meal[];
    is_registered: boolean;
  }

const DashboardPage = () => {
    const [selectedConferenceId, setSelectedConferenceId] = useState<number | null>(null);
    // ... other state
  
    const handleViewDetails = (conference: Conference) => {
      setSelectedConferenceId(conference.id);
    };
  
    const handleBackToDashboard = () => {
      setSelectedConferenceId(null);
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        {selectedConferenceId ? (
          <ConferenceDetails 
            conferenceId={selectedConferenceId}
            onBack={handleBackToDashboard}
            onViewResources={(conference) => {/* handle resources view */}}
          />
        ) : (
          <div>
            {/* Your dashboard content here */}
            {/* ...conference cards, etc. */}
          </div>
        )}
      </div>
    );
  };

export default DashboardPage