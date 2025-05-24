"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Users
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";

// Types
interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  description: string;
  status: string;
  flyer: string;
  resources: Resource[];
}

interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

interface ConferenceDetails {
  id: number;
  is_registered: boolean;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  flyer: string;
  gallery: string[];
  resources: Resource[];
  videos: {
    title?: string;
    description?: string;
    url: string;
  }[];
  meals: {
    meal_id: number;
    name: string;
    image: string;
  }[];
  schedule: {
    schedule_id: number;
    day: string;
    activity: string;
    facilitator: string;
    start: string;
    end: string;
    venue: string;
    posted: string;
  }[];
}

// Media Carousel Component
const MediaCarousel = ({ items, type }: { items: any[], type: 'gallery' | 'videos' }) => {
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
        
        {type === 'videos' && visibleItems[0] && (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
            <video
              src={visibleItems[0].url}
              className="w-full h-full object-cover"
              controls
            />
          </div>
        )}
      </div>
      
      {items.length > itemsPerPage && (
        <>
          <button 
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow hover:bg-background dark:bg-gray-800/80 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow hover:bg-background dark:bg-gray-800/80 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
};

// Conference Details View Component
const ConferenceDetailsView = ({ conference, conferenceDetails, loading, onBack }) => {
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to conferences
        </button>
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
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <FileText className="w-16 h-16" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium">
            {conference.status}
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {conference.title}
            </h1>
          </div>
          
          <div className="mb-4">
            <p className="text-lg sm:text-2xl text-muted-foreground uppercase font-bold">
              {conference.theme}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground text-sm">
                  {conference.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-muted-foreground text-sm">{conference.venue}</p>
              </div>
            </div>
          </div>

          {/* Conference Content Sections */}
          {conferenceDetails.is_registered && (
            <>
              {/* Gallery Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Gallery</h2>
                {conferenceDetails.gallery?.length > 0 ? (
                  <MediaCarousel items={conferenceDetails.gallery} type="gallery" />
                ) : (
                  <p className="text-muted-foreground text-center py-8">No gallery images available</p>
                )}
              </div>

              {/* Schedule Section */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-foreground">Conference Schedule</h2>
                </div>
                {conferenceDetails.schedule?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.schedule.map((item, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex flex-col gap-2">
                          <h3 className="font-medium text-foreground">{item.activity}</h3>
                          {item.facilitator && (
                            <p className="text-sm text-muted-foreground">
                              Facilitator: {item.facilitator}
                            </p>
                          )}
                          <div className="text-sm">
                            <p className="font-medium text-foreground">
                              {item.day}, {item.start} - {item.end}
                            </p>
                            <p className="text-muted-foreground mt-1">
                              {item.venue}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No schedules available</p>
                )}
              </div>

              {/* Resources Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Resources</h2>
                {conferenceDetails.resources?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.resources.map((resource) => (
                      <div key={resource.resource_id} className="bg-muted/50 p-4 rounded-lg border">
                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <h3 className="font-medium text-foreground">{resource.caption}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Added on {new Date(resource.date).toLocaleDateString()}
                            </p>
                            {resource.file && (
                              <a
                                href={resource.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center mt-2 text-primary hover:text-primary/80 text-sm"
                              >
                                Download Resource
                                <ExternalLink className="w-4 h-4 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">No resources available</p>
                )}
              </div>

              {/* Virtual Event Section */}
              <div className="mt-8">
                <h2 className="text-xl font-bold text-foreground mb-4">Virtual Event Access</h2>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="text-muted-foreground mb-3">
                    Join the live event session for virtual attendees
                  </p>
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Join Live Session
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Conference Card Component
const ConferenceCard = ({ conference, onViewDetails }) => {
  return (
    <div className="rounded-lg border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card">
      <div className="relative group">
        <div className="absolute z-20 bottom-5 left-5">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            conference.status === "Completed"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}>
            {conference.status}
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
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <FileText className="w-12 h-12" />
            </div>
          )}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-foreground text-lg font-semibold mb-2">
          {conference.title}
        </h2>
        <p className="text-muted-foreground text-sm mb-3">
          {conference.theme}
        </p>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          {conference.date}
        </div>
        <button
          onClick={() => onViewDetails(conference)}
          className="w-full bg-primary hover:bg-primary/90 px-4 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Component
const ConferencePage = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
      const data = await response.json();
      
      if (data.status === "success") {
        const sortedConferences = data.data.sort((a: Conference, b: Conference) => {
          const yearA = a.title.match(/\d{4}/)?.[0] || "0";
          const yearB = b.title.match(/\d{4}/)?.[0] || "0";
          return parseInt(yearB) - parseInt(yearA);
        });
        
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

  useEffect(() => {
    fetchConferences();
  }, []);

  const handleViewDetails = (conference: Conference) => {
    setSelectedConference(conference);
    fetchConferenceDetails(conference.id);
  };

  const handleBackToList = () => {
    setSelectedConference(null);
    if (conferences.length > 0) {
      setSelectedConference(conferences[0]);
      fetchConferenceDetails(conferences[0].id);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Latest Conference Section */}
        {selectedConference && conferenceDetails && (
          <div className="space-y-4">
            <ConferenceDetailsView
              conference={selectedConference}
              conferenceDetails={conferenceDetails}
              loading={detailsLoading}
              onBack={handleBackToList}
            />
          </div>
        )}

        {/* Past Conferences Section */}
        {conferences.length > 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Past Conferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {conferences.slice(1).map((conference) => (
                <ConferenceCard
                  key={conference.id}
                  conference={conference}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConferencePage;