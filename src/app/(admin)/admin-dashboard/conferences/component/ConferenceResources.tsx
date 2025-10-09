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
  Pencil,
  ChevronLeft,
  ChevronRight
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

// Carousel component for galleries, sponsors, and videos
const MediaCarousel = ({ items, type }: { items: any[], type: 'gallery' | 'sponsors' | 'videos' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = type === 'videos' ? 1 : 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= items.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? Math.max(0, items.length - itemsPerPage) : prevIndex - 1
    );
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {type === 'gallery' && (
          <div className="flex gap-4 transition-transform duration-300">
            {visibleItems.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square w-full min-w-[300px] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={imageUrl}
                  alt={`Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
        
        {type === 'sponsors' && (
          <div className="flex gap-4 transition-transform duration-300">
            {visibleItems.map((sponsor, index) => (
              <div key={index} className="relative aspect-square w-full min-w-[300px] rounded-lg overflow-hidden bg-muted">
                <Image
                  src={sponsor?.logo}
                  alt={sponsor?.name}
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center ">
                  <p className="font-medium text-gray-900 ">{sponsor?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {type === 'videos' && visibleItems[0] && (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {visibleItems[0].type === 'video' ? (
              <video
                src={visibleItems[0].url}
                className="w-full h-full object-cover"
                controls
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                <FileText className="w-12 h-12 text-gray-500 " />
                <p className="text-gray-700 ">Video not available</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {items?.length > itemsPerPage && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow hover:bg-background "
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow hover:bg-background "
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
};

export const ConferenceDetailsView: React.FC<ConferenceDetailsProps> = ({
  conference,
  conferenceDetails,
  loading,
  onBack,
  onEdit,
  onDelete,
  onViewResources,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-foreground ">Failed to load conference details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 "
        >
          <ArrowLeft className="w-4 h-4" />
          Back to conferences
        </Button>
        {/* <AddFileModal/> */}
      </div>
     
      <div className="bg-card rounded-lg shadow-md overflow-hidden border ">
        <div className="relative h-64 sm:h-[400px] bg-muted">
          {conferenceDetails?.flyer ? (
            <Image
              src={conferenceDetails.flyer}
              alt={conference.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground ">
              <FileText className="w-16 h-16" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium ">
            {conferenceDetails?.status}
          </div>
        </div>
      
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 ">
              {conferenceDetails?.title}
            </h1>
            <p className="text-gray-700 text-sm ">
              {conferenceDetails?.registered_count || 0} people have registered for this conference
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-lg sm:text-2xl text-gray-700 uppercase font-bold ">
              {conference?.theme}
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 " />
              <div>
                <p className="font-medium text-gray-700  text-sm">
                  {conference?.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 " />
              <div>
                <p className="font-medium text-gray-700  text-sm">{conference?.venue}</p>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <EditConferenceModal 
              conference={conference} 
              onSuccess={onEdit}
              trigger={
                <Button variant="outline" className="w-full sm:w-auto text-sm text-gray-700   ">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Conference
                </Button>
              }
            />
            
            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <Button variant="outline" className="w-full sm:w-auto text-sm text-gray-700    ">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Conference
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] max-w-[500px] w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-background p-6 rounded-lg shadow-lg  ">
                  <AlertDialog.Title className="text-lg font-semibold ">
                    Delete Conference
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-4 mb-6 text-muted-foreground ">
                    Are you sure you want to delete this conference? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <Button variant="outline" className="  ">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button 
                        variant="destructive"
                        onClick={() => {
                          onDelete();
                          setShowDeleteDialog(false);
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>

            <Button 
              variant="outline" 
              className="w-full sm:w-auto text-sm  text-gray-700  "
              onClick={() => onViewResources(conference)}
            >
              View Resources
            </Button>
          </div>
      
          {!conferenceDetails.is_registered && (
            <div className="bg-yellow-50  border-l-4 border-yellow-400  p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 ">
                    You need to register for this conference to view all details.
                  </p>
                </div>
              </div>
            </div>
          )}
      
          {conferenceDetails.is_registered && (
            <>
              {/* Conference Schedules */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border  mb-6 mt-3 md:mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-md md:text-xl font-bold text-gray-900 ">Conference Schedules</h2>
                  <div className='flex flex-col sm:flex-row gap-2'>
                    <Button variant='outline' className="bg-primary text-white hover:bg-primary/90 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                      Upload Conference Proceedings
                    </Button>
                  </div>
                </div>
                {conferenceDetails?.schedule?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.schedule.map((item, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border ">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-gray-900  text-sm md:text-md">{item?.activity}</h3>
                            {item?.facilitator && (
                              <p className="text-sm text-gray-700 mt-1 ">
                                Facilitator: {item?.facilitator}
                              </p>
                            )}
                          </div>
                          <div className="sm:text-right">
                            <p className="text-sm font-medium text-gray-900 ">
                              {item?.day}, {item?.start} - {item.end}
                            </p>
                            <p className="text-sm text-gray-700 mt-1 ">
                              {item?.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground  text-center py-8">No schedules available</p>
                )}
              </div>

              {/* Speakers Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border  mb-6">
                <h2 className="text-md md:text-xl font-bold text-gray-900  mb-4">Speakers</h2>
                {conferenceDetails?.speakers?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.speakers.map((speaker, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border ">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 ">
                            <Image
                              src={speaker?.picture || '/placeholder.jpg'}
                              alt={speaker?.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 ">{speaker?.name}</h3>
                            {speaker.portfolio && (
                              <p className="text-sm text-gray-700 ">{speaker?.portfolio}</p>
                            )}
                            {speaker.title && (
                              <p className="text-sm text-gray-700  mt-1">{speaker?.title}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground  text-center py-8">No speakers available</p>
                )}
              </div>

              {/* Meals Ticketing */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border  mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-md md:text-xl font-bold text-gray-900 ">Meals Ticketing</h2>
                  
                </div>
                <p className="text-gray-700  text-sm mb-3">
                  These are the list of food currently available for the day. Select any food of your choice
                </p>
                {conferenceDetails?.meals?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.meals.map((item, index) => (
                      <div
                        key={index}
                        className="h-60 relative rounded-lg overflow-hidden bg-muted"
                      >
                        <Image
                          src={item?.image}
                          alt={`Meal ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-100/60 p-2 rounded-t-lg ">
                          <h2 className="text-lg font-bold text-gray-900  mb-2">{item.name}</h2>
                          <div>
                            <Button variant="outline" className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors   ">
                              Select meal
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground  text-center py-8">No Meals available</p>
                )}
              </div>

              {/* Certification Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border  mb-6">
                <h2 className="text-md md:text-xl font-bold text-gray-900  mb-4">Certification</h2>
                <p className="text-gray-700  text-sm">
                  You can get your certificate of attendance <Link href="/members-dashboard/conference-evaluation" className="underline font-bold text-primary ">here</Link>
                </p>
              </div>

              {/* Virtual Event Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border  mb-6">
                <h2 className="text-md md:text-xl font-bold text-gray-900  mb-4">Join event for virtual attendees</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-gray-700  text-sm">You can access the live event from here</p>
                  <Button variant='outline' className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors w-full sm:w-auto text-gray-700    ">
                    Join the live call
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onViewDetails,
}) => {
  return (
    <div className="rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card  ">
      <div className="relative group">
        <div className="absolute z-20 bottom-5 left-5">
          <span
            className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
              conference?.status === "Completed"
                ? "bg-amber-100 text-amber-800  "
                : "bg-blue-100 text-blue-800  "
            }`}
          >
            {conference?.status}
          </span>
        </div>
        <div className="h-48 w-full bg-muted relative overflow-hidden">
          {conference.flyer ? (
            <Image
              src={conference?.flyer}
              alt={conference?.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground ">
              <FileText className="w-12 h-12" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-foreground text-gray-900  text-lg font-semibold line-clamp-2">
            {conference?.title}
          </h2>
        </div>
        <p className="text-gray-700  text-sm mb-3 line-clamp-2">
          {conference?.theme}
        </p>
        <div className="flex items-center text-gray-700 text-xs mb-4">
          <Calendar className="w-3 h-3 mr-1 text-gray-500 " />
          <p className="text-gray-700  text-sm line-clamp-2">{conference?.date}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onViewDetails(conference)}
          className="w-full bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors"
        >
          View Details
        </button>
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
  
      await fetchConferences();
      showToast.success("Conference deleted successfully");
      
      if (selectedConference?.id === conferenceId) {
        setViewMode("list");
        setSelectedConference(null);
      }
    } catch (error) {
      console.error("Error deleting conference:", error);
      showToast.error("Failed to delete conference");
    }
  };

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
    if (conferences.length > 0) {
      setSelectedConference(conferences[0]);
      fetchConferenceDetails(conferences[0].id);
    }
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50  ">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (viewMode === "resources" && selectedConference && conferenceDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50  ">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <button
                onClick={handleBackToList}
                className="flex items-center gap-2 text-gray-700 text-primary hover:text-primary/80 text-sm font-medium  "
              >
                <ArrowLeft className="w-4 h-4" />
                Back to conferences
              </button>
              <AddResourceModal
                conferenceId={selectedConference.id}
                onSuccess={() => fetchConferences()}
              />
            </div>

            <div className="bg-white  rounded-xl shadow-lg border border-blue-100  p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900  mb-2 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    {selectedConference?.title}
                  </h1>
                  <p className="text-gray-600 ">{selectedConference?.theme}</p>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900  mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  Gallery
                </h2>
                {conferenceDetails.gallery?.length > 0 ? (
                  <MediaCarousel items={conferenceDetails.gallery} type="gallery" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileText className="w-10 h-10 mb-2 text-indigo-400" />
                    <p>No gallery images available</p>
                  </div>
                )}
              </div>

              {/* Sponsors Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900  mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Sponsors
                </h2>
                {conferenceDetails.sponsors?.length > 0 ? (
                  <MediaCarousel 
                    items={conferenceDetails.sponsors.map((sponsor: any) => ({
                      logo: sponsor.logo || '',
                      name: sponsor.name || '',
                    }))} 
                    type="sponsors" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileText className="w-10 h-10 mb-2 text-blue-400" />
                    <p>No sponsors available</p>
                  </div>
                )}
              </div>

              {/* Videos Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900  mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  Videos
                </h2>
                {conferenceDetails.videos?.length > 0 ? (
                  <MediaCarousel items={conferenceDetails?.videos} type="videos" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileText className="w-10 h-10 mb-2 text-indigo-400" />
                    <p>No videos available</p>
                  </div>
                )}
              </div>

              {/* Resources Section */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900  mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Resources
                </h2>
                {conferenceDetails.resources?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.resources.map((resource) => (
                      <div key={resource.resource_id} className="bg-gradient-to-br from-green-50 to-emerald-50   p-4 rounded-lg border border-green-200  flex flex-col gap-2">
                        <div className="flex flex-col gap-4">
                          {resource.resource_type?.toLowerCase().includes('video') ? (
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 ">
                              <video
                                src={resource.file}
                                controls
                                className="w-full h-full object-cover"
                                poster="/video-thumbnail.png"
                                preload="metadata"
                              >
                                <source src={resource.file} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center aspect-video rounded-lg bg-gradient-to-br from-green-100 to-emerald-100  ">
                              <FileText className="w-12 h-12 text-green-500 " />
                            </div>
                          )}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 ">{resource?.caption}</h3>
                              <p className="text-sm text-green-600 ">{resource?.resource_type}</p>
                              <p className="text-sm text-gray-600 ">{resource?.date}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button size="sm" variant="destructive" onClick={() => {/* TODO: implement delete */}}>
                                Delete
                              </Button>
                            </div>
                          </div>
                          {!resource?.resource_type?.toLowerCase().includes('video') && (
                            <a
                              href={resource?.file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-700  "
                            >
                              <FileText className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FileText className="w-10 h-10 mb-2 text-green-400" />
                    <p>No resources yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50  ">
      <div className="container mx-auto py-8 px-4">
        {viewMode === "details" && selectedConference ? (
          <ConferenceDetailsView
            conference={selectedConference}
            conferenceDetails={conferenceDetails}
            loading={detailsLoading}
            onBack={handleBackToList}
            onViewResources={handleViewResources}
            onEdit={() => fetchConferenceDetails(selectedConference.id)}
            onDelete={() => handleDeleteConference(selectedConference.id)}
          />
        ) : (
          <div className="space-y-8">
            {/* Header Section with Add Button */}
            <div className="bg-white  rounded-xl shadow-lg border border-blue-100  p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900  mb-2">Conferences</h1>
                  <p className="text-gray-600 ">Manage and view all your conferences</p>
                </div>
                <AddFileModal onSuccess={fetchConferences} />
              </div>
            </div>

            {selectedConference && conferenceDetails && (
              <div className="space-y-4">
                <ConferenceDetailsView
                  conference={selectedConference}
                  conferenceDetails={conferenceDetails}
                  loading={detailsLoading}
                  onBack={handleBackToList}
                  onViewResources={handleViewResources}
                  onEdit={() => fetchConferenceDetails(selectedConference.id)}
                  onDelete={() => handleDeleteConference(selectedConference.id)}
                />
              </div>
            )}

            {conferences.length > 1 && (
              <div className="space-y-6">
                <div className="bg-white  rounded-xl p-6 border border-gray-200  shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900  mb-6 flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    Past Conferences
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {conferences.slice(1).map((conference) => (
                      <ConferenceCard
                        key={conference?.id}
                        conference={conference}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferenceResources;