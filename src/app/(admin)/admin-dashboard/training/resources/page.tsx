"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import AddFileModal from './AddFileModal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

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
  resources: Resource[];
}

interface ConferenceCardProps {
  conference: Conference;
  onViewResources: (conference: Conference) => void;
  onDeleteConference: (id: number) => void;
  onEditConference: (conference: Conference) => void;
}

const ConferenceCard: React.FC<ConferenceCardProps> = ({ 
  conference, 
  onViewResources, 
  onDeleteConference,
  onEditConference 
}) => {
  const resourceCount = conference.resources?.length || 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-4">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{conference.title}</h3>
          <p className="text-sm sm:text-base text-gray-600 mt-1">{conference.theme}</p>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full whitespace-nowrap">
          {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
        </span>
      </div>
      <div className="text-xs sm:text-sm text-gray-500">
        <p className="mb-2">{conference.venue}</p>
        <p>{conference.date}</p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button 
          onClick={() => onViewResources(conference)}
          className="text-blue-600 hover:text-blue-800 font-semibold text-sm sm:text-base flex items-center gap-2"
        >
          View Resources
        </button>
        <button 
          onClick={() => onEditConference(conference)}
          className="text-green-600 hover:text-green-800 font-semibold text-sm sm:text-base flex items-center gap-2"
        >
          Edit
        </button>
        <button 
          onClick={() => onDeleteConference(conference.id)}
          className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base flex items-center gap-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

interface ResourceCardProps {
  resource: Resource;
  onDelete: (resourceId: number) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{resource.caption}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            Added on: {formatDate(resource.date)}
          </p>
          {resource.file && (
            <a
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
            >
              Download Resource
            </a>
          )}
        </div>
        <button
          onClick={() => onDelete(resource.resource_id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchConferences = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
      const data = await response.json();
      if (data.status === "success") {
        const sortedConferences = data.data.sort((a: Conference, b: Conference) => {
          const yearA = a.title.match(/\d{4}/)?.[0] || "0";
          const yearB = b.title.match(/\d{4}/)?.[0] || "0";
          return parseInt(yearB) - parseInt(yearA);
        });
        setConferences(sortedConferences);
      }
    } catch (error) {
      console.error('Error fetching conferences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleDeleteConference = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this conference?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_conference`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conference_id: id }),
      });

      if (response.ok) {
        setConferences(prev => prev.filter(conf => conf.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete conference');
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_resource`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resource_id: resourceId }),
      });

      if (response.ok) {
        if (selectedConference) {
          const updatedResources = selectedConference.resources.filter(
            resource => resource.resource_id !== resourceId
          );
          setSelectedConference({
            ...selectedConference,
            resources: updatedResources
          });
          
          // Update the conferences list as well
          setConferences(prev => prev.map(conf => 
            conf.id === selectedConference.id 
              ? { ...conf, resources: updatedResources }
              : conf
          ));
        }
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete resource');
    }
  };

  const conferencesByYear = conferences.reduce((acc: Record<string, Conference[]>, conference) => {
    const year = conference.title.match(/\d{4}/)?.[0] || "Unknown Year";
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(conference);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      {selectedConference ? (
        // Resources View
        <div>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => setSelectedConference(null)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm sm:text-base"
            >
              ← Back to Conferences
            </button>
          </div>

          <div className="bg-gray-200 px-4 sm:px-5 py-3 mb-6">
            <h1 className="text-xl sm:text-2xl font-semibold">{selectedConference.title}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2">{selectedConference.theme}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{selectedConference.date}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {selectedConference.resources?.map((resource) => (
              <ResourceCard 
                key={resource.resource_id} 
                resource={resource} 
                onDelete={handleDeleteResource}
              />
            ))}
          </div>

          {(!selectedConference.resources || selectedConference.resources.length === 0) && (
            <div className="text-center py-12 text-gray-600">
              No resources available for this conference.
            </div>
          )}
        </div>
      ) : (
        // Conferences List View
        <>
          <div className="bg-gray-200 px-4 sm:px-5 py-3 mb-6 mt-10">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl">Seminar Resources</h1>
              <AddFileModal onSuccess={fetchConferences}/>
            </div>
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto py-2">
            {Object.keys(conferencesByYear).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year === selectedYear ? null : year)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors
                  ${selectedYear === year 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {year} ({conferencesByYear[year].length})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {(selectedYear ? conferencesByYear[selectedYear] : conferences).map((conference) => (
              <ConferenceCard 
                key={conference.id} 
                conference={conference} 
                onViewResources={setSelectedConference}
                onDeleteConference={handleDeleteConference}
                onEditConference={() => {/* Add edit functionality */}}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ConferenceResources;