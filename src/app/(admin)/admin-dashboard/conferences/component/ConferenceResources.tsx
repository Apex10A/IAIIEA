"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AddFileModal from "./AddFileModal";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import EditConferenceModal from './EditEvents';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Trash2,
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Play,
  FileText,
  Loader2,
  Plus,
  Pencil
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";
import { 
  Conference, 
  ConferenceDetails, 
  ConferenceDetailsProps,
  ConferenceCardProps
} from "./interfaces";
import { ResourceCard, AddResourceModal } from "./components";

export const ConferenceDetailsView: React.FC<ConferenceDetailsProps> = ({
  conference,
  conferenceDetails,
  loading,
  onBack,
  onEdit,
  onDelete,
  onViewResources,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Failed to load conference details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
     <div className='flex items-center justify-between'>
       <Button
        onClick={onBack}
         variant="outline"
        className="flex items-center gap-2 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to conferences
      </Button>
       <AddFileModal/>
     </div>
     
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-[400px] bg-gray-100">
                {conferenceDetails?.flyer ? (
                  <Image
                    src={conferenceDetails.flyer}
                    alt={conference.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <FileText className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium">
                  {conference.status}
                </div>
              </div>
      
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {conference.title}
                </h1>
             
                <p className="text-gray-800 ">171 people have registered for this conference</p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                <p className="text-2xl text-gray-800 uppercase font-bold">
                  {conference.theme}
                </p>
                </div>
      
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 " />
                    <div className="flex">
                      {/* <p className="text-sm text-gray-500">Date</p> */}
                      <p className="font-medium text-gray-500">
                        {conference.date}
                      </p>
                    
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 " />
                    <div>
                      {/* <p className="text-sm text-gray-500">Venue</p> */}
                      <p className="font-medium text-gray-500">{conference.venue}</p>
                    </div>
                  </div>
                   <div className="flex gap-2 mt-5">
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Conference
            </Button>
            <Button variant="destructive" className="bg-red-500 text-white" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Conference
            </Button>
          </div>
                </div>
      
                {!conferenceDetails.is_registered && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          You need to register for this conference to view all details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
      
      
              </div>
            </div>
      
          
      
            {conferenceDetails.is_registered && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Gallery</h2>
                  {conferenceDetails?.gallery && conferenceDetails.gallery.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {conferenceDetails.gallery.map((imageUrl, index) => (
                        <div
                          key={index}
                          className="relative h-40 rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No gallery images available</p>
                  )}
                </div>
      
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 ">Conference Schedules</h2>
                     <div className='flex gap-2'>
                      <button   className="bg-[#203a87] hover:bg-blue-800 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors">Create Conference Schedule</button>
                   <button   className="bg-[#203a87] hover:bg-blue-800 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors">Download Conference Preceeding</button>
                     </div>
                  </div>
                  {conferenceDetails?.schedule && conferenceDetails.schedule.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {conferenceDetails.schedule.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{item.activity}</h3>
                            {item.facilitator && (
                              <p className="text-sm text-gray-600 mt-1">
                                Facilitator: {item.facilitator}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {item.day}, {item.start} - {item.end}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No schedules available</p>
                    
      
                  )}
                </div>
      
      
                <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Meals Ticketing</h2>
                  <button   className="bg-[#203a87] hover:bg-blue-800 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors">Add Meals</button>
                </div>
      
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">This are the list of food currently available for the day. Select any food of your choice</p>
                  {conferenceDetails?.meals && conferenceDetails.meals.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {conferenceDetails.meals.map((item, index) => (
                        <div
                          key={index}
                          className="h-60 relative rounded-lg overflow-hidden bg-gray-100"
                        >
                          <Image
                            src={item.image}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-2 rounded-t-lg">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">{item.name}</h2>
                          <div>
                            <button   className="bg-[#203a87] hover:bg-blue-700 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors">select meal</button>
                          </div>
                        </div>
                        </div>
                        
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No Meals available</p>
                  )}
                </div>
      
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Videos</h2>
                  {conferenceDetails?.videos && conferenceDetails.videos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conferenceDetails.videos.map((video, index) => (
                        <div key={index} className="relative h-40 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={video.url}
                            alt={`Video ${index + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No videos available</p>
                  )}
                  </div>
      
                  <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Certification</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">You can get your certificate of attendance <Link href="/members-dashboard/conference-evaluation" className="underline font-bold">here</Link></p>
                  </div>
      
                  <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Join event for virtual attendees</h2>
                  <div className="flex items-center gap-3">
                  <p className="text-gray-600 text-sm line-clamp-2">You can access the live event from here</p>
                  <button className="bg-[#203a87] hover:bg-blue-700 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors">Join the live call</button>
                  </div>
                  </div>
                
                
      
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Resources</h2>
                    <button
                      onClick={() => onViewResources(conference)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                    >
                      View all resources <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  {conferenceDetails?.resources && conferenceDetails.resources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {conferenceDetails.resources.slice(0, 4).map((resource) => (
                        <ResourceCard
                          key={resource.resource_id}
                          resource={resource}
                          onDelete={() => {}}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No resources available</p>
                  )}
                </div>
              </>
            )}
    </div>
  );
};

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onViewResources,
  onViewDetails,
  onEditConference,
  onDeleteConference,
}) => {
  const resourceCount = conference.resources?.length || 0;
  const handleDelete = async () => {
    try {
      await onDeleteConference(conference.id);
      showToast.success("Conference deleted successfully");
    } catch (error) {
      showToast.error("Failed to delete conference");
    }
  };

  return (
     <div className="rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-white">
         <div className="relative group">
           <div className="absolute z-20 bottom-5 left-5">
             <span
               className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
                 conference?.status === "Completed"
                   ? "bg-amber-100 text-amber-800"
                   : "bg-blue-100 text-blue-800"
               }`}
             >
               {conference?.status}
             </span>
           </div>
           <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
             {conference.flyer ? (
               <Image
                 src={conference.flyer}
                 alt={conference.title}
                 fill
                 className="object-cover transition-transform duration-300 group-hover:scale-105"
               />
             ) : (
               <div className="flex items-center justify-center h-full text-gray-400">
                 <FileText className="w-12 h-12" />
               </div>
             )}
           </div>
         </div>
         <div className="p-4">
           <div className="flex items-start justify-between mb-3">
             <h2 className="text-gray-900 text-lg font-semibold line-clamp-2">
               {conference.title}
             </h2>
             <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
               {resourceCount} {resourceCount === 1 ? "resource" : "resources"}
             </span>
           </div>
           <p className="text-gray-600 text-sm mb-3 line-clamp-2">
             {conference.theme}
           </p>
           <div className="flex items-center text-gray-500 text-xs mb-4">
             <Calendar className="w-3 h-3 mr-1" />
             <p className="text-gray-600 text-sm mb-3 line-clamp-2">{conference.date}</p>
           </div>
         </div>
         <div className="px-4 pb-4 grid grid-cols-2 gap-2">
           <button
             onClick={() => onViewDetails(conference)}
             className="bg-[#203a87] hover:bg-blue-700 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors"
           >
             View Details
           </button>
           <button
             onClick={() => onViewResources(conference)}
             className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-gray-700 text-sm font-medium transition-colors"
           >
             View Resources
           </button>
             <EditConferenceModal 
                       conference={conference} 
                     onSuccess={onEditConference} 
                   />
             <AlertDialog.Root>
     <AlertDialog.Trigger asChild>
       <button className="px-3 py-2 rounded-md text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors">
         Delete Conference
       </button>
     </AlertDialog.Trigger>
     <AlertDialog.Portal>
       <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
       <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
         <AlertDialog.Title className="text-lg font-semibold text-gray-900">
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
               onClick={() => onDeleteConference(conference.id)}
               className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
             >
               Delete Conference
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

const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "details" | "resources">("list");
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/events`
      );
      const data = await response.json();
      if (data.status === "success") {
        const sortedConferences = data.data.sort(
          (a: Conference, b: Conference) => {
            const yearA = a.title.match(/\d{4}/)?.[0] || "0";
            const yearB = b.title.match(/\d{4}/)?.[0] || "0";
            return parseInt(yearB) - parseInt(yearA);
          }
        );
        setConferences(sortedConferences);
        
        // Automatically select the latest conference (first in the sorted array)
        if (sortedConferences.length > 0) {
          const latestConference = sortedConferences[0];
          setSelectedConference(latestConference);
          fetchConferenceDetails(latestConference.id);
        }
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      showToast.error("Failed to load conferences");
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteConference = async (conferenceId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_conference/${conferenceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete conference");
      }
  
      // Refresh the conferences list
      await fetchConferences();
      showToast.success("Conference deleted successfully");
    } catch (error) {
      console.error("Error deleting conference:", error);
      showToast.error("Failed to delete conference");
    }
  };
  const fetchConferenceDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conference details");
      }

      const data = await response.json();
      setConferenceDetails(data.data);
    } catch (error) {
      console.error("Error fetching conference details:", error);
      showToast.error("Failed to load conference details");
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleViewDetails = (conference: Conference) => {
    setSelectedConference(conference);
    setViewMode("details");
    fetchConferenceDetails(conference.id);
  };

  const handleViewResources = (conference: Conference) => {
    setSelectedConference(conference);
    setViewMode("resources");
  };

  const handleBackToList = () => {
    setViewMode("list");
    // Reset to show the latest conference details
    if (conferences.length > 0) {
      setSelectedConference(conferences[0]);
      fetchConferenceDetails(conferences[0].id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (viewMode === "resources" && selectedConference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to conferences
            </button>
            <AddResourceModal
              conferenceId={selectedConference.id}
              onSuccess={() => fetchConferences()}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {selectedConference.title}
                </h1>
                <p className="text-gray-600">{selectedConference.theme}</p>
              </div>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                {selectedConference.resources?.length || 0} resources
              </span>
            </div>

            {selectedConference.resources?.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedConference.resources.map((resource) => (
                  <ResourceCard
                    key={resource.resource_id}
                    resource={resource}
                    onDelete={() => {}}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No resources yet
                </h3>
                <p className="text-gray-500">
                  Add resources to make them available to attendees
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {viewMode === "details" && selectedConference ? (
        <ConferenceDetailsView
          conference={selectedConference}
          conferenceDetails={conferenceDetails}
          loading={detailsLoading}
          onBack={handleBackToList}
          onViewResources={handleViewResources}
        />
      ) : (
        <div className="space-y-8">
          {/* Latest Conference Section */}
          {selectedConference && conferenceDetails && (
            <div className="space-y-4">
              {/* <h2 className="text-2xl font-bold text-gray-900">Current Conference</h2> */}
              <ConferenceDetailsView
                conference={selectedConference}
                conferenceDetails={conferenceDetails}
                loading={detailsLoading}
                onBack={handleBackToList}
                onViewResources={handleViewResources}
              />
            </div>
          )}

          {/* Past Conferences Section */}
          {conferences.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Past Conferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conferences.slice(1).map((conference) => (
                  <ConferenceCard
                    key={conference.id}
                    conference={conference}
                    onViewResources={handleViewResources}
                    onViewDetails={handleViewDetails}
                    onEditConference={fetchConferences} // Refresh list after edit
                    onDeleteConference={handleDeleteConference} // Pass the delete function
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConferenceResources;