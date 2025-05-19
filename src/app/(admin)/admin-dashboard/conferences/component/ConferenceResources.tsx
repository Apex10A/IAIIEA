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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!conferenceDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-foreground dark:text-gray-100">Failed to load conference details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to conferences
        </Button>
        <AddFileModal/>
      </div>
     
      <div className="bg-card rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
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
            <div className="flex items-center justify-center h-full text-muted-foreground dark:text-gray-400">
              <FileText className="w-16 h-16" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-800 dark:text-gray-200">
            {conference.status}
          </div>
        </div>
      
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground dark:text-gray-100">
              {conference.title}
            </h1>
            <p className="text-muted-foreground dark:text-gray-300">
              {conferenceDetails.registered_count || 0} people have registered for this conference
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-lg sm:text-2xl text-muted-foreground uppercase font-bold dark:text-gray-300">
              {conference.theme}
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <div>
                <p className="font-medium text-muted-foreground dark:text-gray-300">
                  {conference.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <div>
                <p className="font-medium text-muted-foreground dark:text-gray-300">{conference.venue}</p>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <EditConferenceModal 
              conference={conference} 
              onSuccess={onEdit}
              trigger={
                <Button variant="outline" className="w-full sm:w-auto dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Conference
                </Button>
              }
            />
            
            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <Button variant="destructive" className="w-full sm:w-auto">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Conference
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] max-w-[500px] w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-background p-6 rounded-lg shadow-lg dark:border dark:border-gray-700">
                  <AlertDialog.Title className="text-lg font-semibold dark:text-gray-100">
                    Delete Conference
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-4 mb-6 text-muted-foreground dark:text-gray-300">
                    Are you sure you want to delete this conference? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <Button variant="outline" className="dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">
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
          </div>
      
          {!conferenceDetails.is_registered && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    You need to register for this conference to view all details.
                  </p>
                </div>
              </div>
            </div>
          )}
      
          {conferenceDetails.is_registered && (
            <>
              {/* Gallery Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">Gallery</h2>
                {conferenceDetails?.gallery?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {conferenceDetails.gallery.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted"
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
                  <p className="text-muted-foreground dark:text-gray-400 text-center py-8">No gallery images available</p>
                )}
              </div>
      
              {/* Conference Schedules */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-foreground dark:text-gray-100">Conference Schedules</h2>
                  <div className='flex flex-col sm:flex-row gap-2'>
                    <button className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors">
                      Create Conference Schedule
                    </button>
                    <button className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors">
                      Download Conference Proceedings
                    </button>
                  </div>
                </div>
                {conferenceDetails?.schedule?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.schedule.map((item, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-medium dark:text-gray-100">{item.activity}</h3>
                            {item.facilitator && (
                              <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                                Facilitator: {item.facilitator}
                              </p>
                            )}
                          </div>
                          <div className="sm:text-right">
                            <p className="text-sm font-medium dark:text-gray-200">
                              {item.day}, {item.start} - {item.end}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1 dark:text-gray-400">
                              {item.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground dark:text-gray-400 text-center py-8">No schedules available</p>
                )}
              </div>

              {/* Meals Ticketing */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-foreground dark:text-gray-100">Meals Ticketing</h2>
                  <button className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors">
                    Add Meals
                  </button>
                </div>
                <p className="text-muted-foreground dark:text-gray-400 text-sm mb-3">
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
                          src={item.image}
                          alt={`Meal ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 rounded-t-lg dark:bg-gray-800/90">
                          <h2 className="text-lg font-bold text-foreground dark:text-gray-100 mb-2">{item.name}</h2>
                          <div>
                            <button className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors">
                              Select meal
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground dark:text-gray-400 text-center py-8">No Meals available</p>
                )}
              </div>

              {/* Videos Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">Videos</h2>
                {conferenceDetails?.videos?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conferenceDetails.videos.map((video, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        {video.type === 'video' ? (
                          <>
                            <video
                              src={video.url}
                              className="w-full h-full object-cover"
                              controls
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="w-10 h-10 text-white bg-black/50 rounded-full p-2" />
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <FileText className="w-12 h-12 text-muted-foreground dark:text-gray-400" />
                            <p className="text-muted-foreground dark:text-gray-400">Video not available</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-video flex flex-col items-center justify-center gap-2 bg-muted rounded-lg">
                    <FileText className="w-12 h-12 text-muted-foreground dark:text-gray-400" />
                    <p className="text-muted-foreground dark:text-gray-400">No videos available</p>
                  </div>
                )}
              </div>

              {/* Certification Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">Certification</h2>
                <p className="text-muted-foreground dark:text-gray-400 text-sm">
                  You can get your certificate of attendance <Link href="/members-dashboard/conference-evaluation" className="underline font-bold text-primary dark:text-primary-400">here</Link>
                </p>
              </div>

              {/* Virtual Event Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-xl font-bold text-foreground dark:text-gray-100 mb-4">Join event for virtual attendees</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-muted-foreground dark:text-gray-400 text-sm">You can access the live event from here</p>
                  <button className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors w-full sm:w-auto">
                    Join the live call
                  </button>
                </div>
              </div>

              {/* Resources Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-xl font-bold text-foreground dark:text-gray-100">Resources</h2>
                  <button
                    onClick={() => onViewResources(conference)}
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View all resources <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                {conferenceDetails?.resources?.length > 0 ? (
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
                  <div className="text-center py-8">
                    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-10 h-10 text-muted-foreground dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground dark:text-gray-100 mb-1">
                      No resources available
                    </h3>
                  </div>
                )}
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
  onViewResources,
  onViewDetails,
}) => {
  const resourceCount = conference.resources?.length || 0;

  return (
    <div className="rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card dark:border-gray-700 dark:hover:shadow-gray-700/30">
      <div className="relative group">
        <div className="absolute z-20 bottom-5 left-5">
          <span
            className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
              conference?.status === "Completed"
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            }`}
          >
            {conference?.status}
          </span>
        </div>
        <div className="h-48 w-full bg-muted relative overflow-hidden">
          {conference.flyer ? (
            <Image
              src={conference.flyer}
              alt={conference.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground dark:text-gray-400">
              <FileText className="w-12 h-12" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-foreground dark:text-gray-100 text-lg font-semibold line-clamp-2">
            {conference.title}
          </h2>
          <span className="bg-muted text-muted-foreground dark:text-gray-400 text-xs px-2 py-1 rounded ml-2 whitespace-nowrap">
            {resourceCount} {resourceCount === 1 ? "resource" : "resources"}
          </span>
        </div>
        <p className="text-muted-foreground dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {conference.theme}
        </p>
        <div className="flex items-center text-muted-foreground text-xs mb-4">
          <Calendar className="w-3 h-3 mr-1 text-muted-foreground dark:text-gray-400" />
          <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-2">{conference.date}</p>
        </div>
      </div>
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewDetails(conference)}
          className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onViewResources(conference)}
          className="bg-muted hover:bg-muted/80 px-3 py-2 rounded-md text-muted-foreground dark:text-gray-300 text-sm font-medium transition-colors dark:hover:bg-gray-700"
        >
          View Resources
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (viewMode === "resources" && selectedConference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <button
              onClick={handleBackToList}
              className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to conferences
            </button>
            <AddResourceModal
              conferenceId={selectedConference.id}
              onSuccess={() => fetchConferences()}
            />
          </div>

          <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-foreground dark:text-gray-100">
                  {selectedConference.title}
                </h1>
                <p className="text-muted-foreground dark:text-gray-400">{selectedConference.theme}</p>
              </div>
              <span className="bg-muted text-muted-foreground dark:text-gray-400 px-3 py-1 rounded-full text-sm">
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
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-muted-foreground dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-foreground dark:text-gray-100 mb-1">
                  No resources yet
                </h3>
                <p className="text-muted-foreground dark:text-gray-400">
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
    <div className="container mx-auto py-8">
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground dark:text-gray-100">Past Conferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {conferences.slice(1).map((conference) => (
                  <ConferenceCard
                    key={conference.id}
                    conference={conference}
                    onViewResources={handleViewResources}
                    onViewDetails={handleViewDetails}
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