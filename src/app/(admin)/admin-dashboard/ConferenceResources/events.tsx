import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import AddFileModal from './AddFileModal';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Trash2, Calendar, MapPin, Tag, ArrowLeft } from 'lucide-react';
import { showToast } from '@/utils/toast';
import Image from 'next/image';

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
  onViewDetails: (conference: Conference) => void;
  onDeleteConference: (id: number) => void;
  onEditConference: (conference: Conference) => void;
}

const ConferenceCard: React.FC<ConferenceCardProps> = ({ 
  conference, 
  onViewResources, 
  onViewDetails,
  onDeleteConference,
  onEditConference 
}) => {
  const resourceCount = conference.resources?.length || 0;
  
  const handleDelete = async () => {
    try {
      await onDeleteConference(conference.id);
      showToast.success('Conference deleted successfully');
    } catch (error) {
      showToast.error('Failed to delete conference');
    }
  };

  // Function to get background color based on index
  const getBgColor = (index: number) => {
    const colors = ['bg-blue-50', 'bg-amber-50', 'bg-emerald-50'];
    return colors[index % colors.length];
  };

  return (
    <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="absolute z-20 bottom-5 left-5">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
              conference.status === "Completed"
                ? "bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]"
                : "bg-[#203A87] text-white hover:bg-[#152a61]"
            }`}
          >
            {conference.status}
          </button>
        </div>
        <Image
          src="/Meeting.png"
          alt={conference.title}
          width={600}
          height={400}
          className="w-full h-[250px] object-cover"
        />
      </div>
      <div className='p-4'>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[#0B142F] text-2xl lg:text-4xl font-semibold">
            {conference.title}
          </h1>
        </div>
        <p className="text-[#0B142F] text-base lg:text-lg font-medium mb-4 line-clamp-2">
          {conference.theme}
        </p>
        <p className="text-gray-600 text-sm lg:text-base font-medium mb-6">
          {conference.date}
        </p>
      </div>
      <div className="mt-4 flex justify-between gap-2 px-4 pb-4">
        <button
          onClick={() => onViewDetails(conference)}
          className="bg-[#203A87] px-4 py-3 rounded-lg text-white font-medium hover:bg-[#152a61] transition-colors duration-300 flex-grow sm:flex-grow-0"
        >
          View Details
        </button>
        <AlertDialog.Root>
          <AlertDialog.Trigger asChild>
            <button className="text-red-600 hover:text-red-800 font-semibold text-sm sm:text-base flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </AlertDialog.Trigger>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
            <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
              <AlertDialog.Title className="text-lg font-semibold">
                Delete Conference
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
                Are you sure you want to delete this conference? This action cannot be undone.
              </AlertDialog.Description>
              <div className="flex justify-end gap-4">
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button 
                    onClick={handleDelete}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
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
  
  const handleDelete = async () => {
    try {
      await onDelete(resource.resource_id);
      showToast.success('Resource deleted successfully');
    } catch (error) {
      showToast.error('Failed to delete resource');
    }
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

// New Conference Details Component
interface ConferenceDetailsProps {
  conference: Conference;
  onBack: () => void;
  onViewResources: (conference: Conference) => void;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({ 
  conference, 
  onBack,
  onViewResources
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative">
        <button 
          onClick={onBack}
          className="absolute z-10 top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/90 rounded-lg text-gray-700 hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <div className="absolute z-10 bottom-4 right-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
              conference.status === "Completed"
                ? "bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]"
                : "bg-[#203A87] text-white hover:bg-[#152a61]"
            }`}
          >
            {conference.status}
          </button>
        </div>
        
        <Image
          src="/Meeting.png"
          alt={conference.title}
          width={800}
          height={400}
          className="w-full h-[300px] md:h-[400px] object-cover"
        />
      </div>
      
      <div className="p-6 md:p-8">
       <div className='flex items-center justify-between'>
       <h1 className="text-gray-700 text-base md:text-lg leading-relaxed">
          {conference.title}
        </h1>
        <p>100+ people registered <a href="" className='underline font-bold'>access participant directory</a></p>
       </div>
        
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6">
          <p className="text-3xl md:text-4xl font-bold text-[#0B142F] mb-4">
            {conference.theme}
          </p>
        </div>
        <div className='mb-6'>
          <hr />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#203A87] mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date</h3>
              <p className="text-base md:text-lg font-medium text-[#0B142F]">{conference.date}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[#203A87] mt-1" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Venue</h3>
              <p className="text-base md:text-lg font-medium text-[#0B142F]">{conference.venue}</p>
            </div>
          </div>
        </div>
        <div className='my-6'>
          <hr />
        </div>
        <div>
          <h1 className='text-2xl mb-3'>Resources</h1>
          <p>View <a href="" className='underline font-bold'>Conference preceeding</a></p>
          <div className='flex items-center gap-4 justify-between'>
          <p>Get the conference resources by each speaker here</p>
          <button className='px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 text-[#fff] bg-[#152a61]'>Resources</button>
          </div>
        </div>
        <div className='my-6'>
          <hr />
        </div>
        <div>
        <h1 className='text-2xl mb-3'>Daily conference schedule</h1>
        </div>
        <div className='my-6'>
          <hr />
        </div>
        <div>
        <h1 className='text-2xl mb-3'>Meal Ticketing</h1>
        <p>This are the list of food currently available for the day. Select any food of your choice</p>
        </div>
        <div className='my-6'>
          <hr />
        </div>
        <div>
        <h1 className='text-2xl mb-3'>Join event for virtual attendees</h1>
        <div className='flex items-center gap-4 justify-between'>
          <p>You can access the live event from here</p>
          <button onClick={() => onViewResources(conference)} className='px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 text-[#fff] bg-[#152a61]'>Join in</button>
          </div>
        </div>
        <div className='my-6'>
          <hr />
        </div>
        <div>
        <h1 className='text-2xl mb-3'>Certification</h1>
        <p>Complete the conference evaluation to <a href="" className='underline font-bold'>access certificate</a></p>
        </div>
      </div>
    </div>
  );
};

// Main component
const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details' | 'resources'>('list');
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchConferences = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
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
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_conference`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });

      if (response.ok) {
        showToast.success('Conference deleted successfully');
        setConferences(prev => prev.filter(conf => conf.id !== id));
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast.error('Failed to delete conference');
    }
  };

  const handleDeleteResource = async (resourceId: number) => {
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
        showToast.success('Resource deleted successfully');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showToast.error('Failed to delete resource');
    }
  };

  const handleViewDetails = (conference: Conference) => {
    setSelectedConference(conference);
    setViewMode('details');
  };

const handleViewResources = (conference: Conference) => {
  setSelectedConference(conference);
  setViewMode('resources');
};

  const handleBackToDashboard = () => {
    setViewMode('list');
    setSelectedConference(null);
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
      {viewMode === 'resources' && selectedConference ? (
        // Resources View
        <div>
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={handleBackToDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <AddFileModal />
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
      ) : viewMode === 'details' && selectedConference ? (
        // Conference Details View
        <ConferenceDetails 
          conference={selectedConference} 
          onBack={handleBackToDashboard}
          onViewResources={handleViewResources}
        />
      ) : (
        // Conferences List View
        <>
          <div className="px-4 sm:px-5 py-3 mb-6 mt-10">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl">Conference Events</h1>
              <AddFileModal/>
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
                onViewResources={handleViewResources}
                onViewDetails={handleViewDetails}
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