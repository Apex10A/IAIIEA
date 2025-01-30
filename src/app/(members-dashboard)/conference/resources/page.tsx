"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, X, FileText } from 'lucide-react';
import Spinner from "@/app/spinner";
import SkeletonLoader from './ConferenceLoader'

// TypeScript interfaces
interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  is_registered: boolean;
  resources: Resource[];
}

const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch conferences
  useEffect(() => {
    const fetchConferences = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/events`,
          {
            headers: {
              'Authorization': `Bearer ${bearerToken}`,
            }
          }
        );
        const data = await response.json();
        
        if (data.status === "success") {
          setConferences(data.data);
        }
      } catch (error) {
        console.error('Error fetching conferences:', error);
      } finally {
        setLoading(false);
      }
    };

    if (bearerToken) {
      fetchConferences();
    }
  }, [bearerToken]);

  // Fetch conference details and resources
  const handleViewResources = async (conferenceId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
          }
        }
      );
      const data = await response.json();
      
      if (data.status === "success") {
        setSelectedConference(data.data);
      }
    } catch (error) {
      console.error('Error fetching conference details:', error);
    }
  };

  // Resource list component
  const ResourceList: React.FC<{ resources: Resource[] }> = ({ resources }) => {
    return (
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.resource_id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-start gap-4">
              <FileText className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">{resource.caption}</h3>
                <p className="text-sm text-gray-500 mt-1">Date: {resource.date}</p>
                <a 
                  href={resource.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mt-2 inline-block"
                >
                  Download Resource
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SkeletonLoader/>
      </div>
    );
  }

  return (
    <div className="p-6">
         <div className='bg-gray-200 px-5 py-3 mb-6 '>
        <h1 className="text-lg md:text-2xl text-black">CONFERENCE RESOURCES</h1>
      </div>

      {selectedConference ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B142F]">{selectedConference.title}</h2>
              <p className="text-gray-600 mt-2">{selectedConference.theme}</p>
            </div>
            <button 
              onClick={() => setSelectedConference(null)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {!selectedConference.is_registered ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">
                You must be registered for this conference to access its resources.
              </p>
            </div>
          ) : selectedConference.resources.length > 0 ? (
            <ResourceList resources={selectedConference.resources} />
          ) : (
            <p className="text-gray-500">No resources available for this conference.</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conferences.map((conference) => (
            <div 
              key={conference.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <h3 className="text-lg font-semibold mb-2">{conference.title}</h3>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{conference.date}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{conference.venue}</span>
              </div>
              <button
                onClick={() => handleViewResources(conference.id)}
                className="bg-[#203a87] hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full"
              >
                View Resources
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceResources;