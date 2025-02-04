"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, X, FileText, Info } from 'lucide-react';
import SkeletonLoader from './ConferenceLoader';

// TypeScript interfaces
interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}
interface Meal {
  meal_id: number;
  name: string;
  image: string;
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
  meals: Meal[];
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  start_date: string;
}

const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [viewMode, setViewMode] = useState<'details' | 'resources'>('details');
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

  // Fetch conference details
  const handleViewConference = async (conferenceId: number) => {
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

  const ConferenceDetails: React.FC<{ conference: Conference }> = ({ conference }) => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Conference Information</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Theme</h4>
              <p className="text-gray-600 font-bold text-md md:text-lg">{conference.theme}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Sub Themes</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {conference.sub_theme?.map((theme, index) => (
                  <li key={index}>{theme}</li>
                ))}
              </ul>
            </div>
            {conference.work_shop && conference.work_shop.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700">Workshops</h4>
                <ul className="list-disc pl-5 text-gray-600 space-y-2">
                  {conference.work_shop.map((workshop, index) => (
                    <li key={index}>{workshop}</li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="font-medium text-gray-700">Important Dates</h4>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                {conference.important_date?.map((date, index) => (
                  <li key={index}>{date}</li>
                ))}
              </ul>
            </div>
            {conference.meals && conference.meals.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Meal Ticketing</h4>
              <p className="text-gray-600 mb-4">These are the meals currently available for the day. Select any meal of your choice:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {conference.meals.map((meal) => (
                  <div key={meal.meal_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-w-16 aspect-h-9 mb-3">
                      {meal.image ? (
                        <img 
                          src={meal.image} 
                          alt={meal.name}
                          className="object-cover rounded-md w-full h-48"
                        />
                      ) : (
                        <div className="bg-gray-200 rounded-md w-full h-48 flex items-center justify-center">
                          <span className="text-gray-400">No image available</span>
                        </div>
                      )}
                    </div>
                    <h5 className="font-medium text-gray-800">{meal.name}</h5>
                  </div>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="bg-gray-200 px-5 py-3 mb-6">
        <h1 className="text-lg md:text-2xl text-black">CONFERENCE RESOURCES</h1>
      </div>

      {selectedConference ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#0B142F]">{selectedConference.title}</h2>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedConference.date}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedConference.venue}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setViewMode(viewMode === 'details' ? 'resources' : 'details')}
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                {viewMode === 'details' ? (
                  <>
                    <FileText className="w-4 h-4" />
                    View Resources
                  </>
                ) : (
                  <>
                    <Info className="w-4 h-4" />
                    View Details
                  </>
                )}
              </button>
              <button 
                onClick={() => setSelectedConference(null)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {!selectedConference.is_registered ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">
                You must be registered for this conference to access its resources.
              </p>
            </div>
          ) : viewMode === 'details' ? (
            <ConferenceDetails conference={selectedConference} />
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
                onClick={() => handleViewConference(conference.id)}
                className="bg-[#203a87] hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceResources;