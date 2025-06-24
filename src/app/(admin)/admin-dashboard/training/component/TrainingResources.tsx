"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AddFileModal from "./AddFileModal";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import EditSeminarModal from './EditSeminars';
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
} from "./index";
import { ResourceCard, AddResourceModal } from "./components";
import { Seminar, SeminarDetails, SeminarDetailsProps, SeminarCardProps } from './index';

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
                  src={sponsor.logo}
                  alt={sponsor.name}
                  fill
                  className="object-contain p-4"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center dark:bg-gray-800/90">
                  <p className="font-medium dark:text-gray-100">{sponsor.name}</p>
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
                <FileText className="w-12 h-12 text-muted-foreground dark:text-gray-400" />
                <p className="text-muted-foreground dark:text-gray-400">Video not available</p>
              </div>
            )}
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
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to seminars
        </Button>
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
            <p className="text-muted-foreground text-sm dark:text-gray-300">
              {conferenceDetails?.registered_count || 0} people have registered for this conference
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
                <p className="font-medium text-muted-foreground dark:text-gray-300 text-sm">
                  {conference.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground dark:text-gray-400" />
              <div>
                <p className="font-medium text-muted-foreground dark:text-gray-300 text-sm">{conference.venue}</p>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <EditSeminarModal 
              seminar={{
                id: conference.id,
                title: conference.title,
                theme: conference.theme,
                venue: conference.venue,
                start_date: conferenceDetails?.start_date || '',
                start_time: conferenceDetails?.start_time || '',
                status: conference.status,
                speakers: conferenceDetails?.speakers || [],
                payments: conferenceDetails?.payments || []
              }}
              onSuccess={onEdit}
              trigger={
                <Button variant="outline" className="w-full sm:w-auto text-sm dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Conference
                </Button>
              }
            />
            
            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <Button variant="outline" className="w-full sm:w-auto text-sm dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
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

            {/* <Button 
              variant="outline" 
              className="w-full sm:w-auto text-sm dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => onViewResources(conference)}
            >
              View Resources
            </Button> */}
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
              {/* Conference Schedules */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6 mt-3 md:mt-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h2 className="text-md md:text-xl font-bold text-foreground dark:text-gray-100">Conference Schedules</h2>
                  <div className='flex flex-col sm:flex-row gap-2'>
                    
                    <Button variant='outline' className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                      Upload Conference Proceedings
                    </Button>
                  </div>
                </div>
                {conferenceDetails?.schedule?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {conferenceDetails.schedule.map((item, index) => (
                      <div key={index} className="bg-muted/50 p-4 rounded-lg border dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-medium dark:text-gray-100 text-sm md:text-md">{item.activity}</h3>
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
                  <h2 className="text-md md:text-xl font-bold text-foreground dark:text-gray-100">Meals Ticketing</h2>
                  
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-100/60 p-2 rounded-t-lg dark:bg-gray-800/90">
                          <h2 className="text-lg font-bold text-foreground dark:text-gray-100 mb-2">{item.name}</h2>
                          <div>
                            <Button variant="outline" className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                              Select meal
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground dark:text-gray-400 text-center py-8">No Meals available</p>
                )}
              </div>

              {/* Certification Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-md md:text-xl font-bold text-foreground dark:text-gray-100 mb-4">Certification</h2>
                <p className="text-muted-foreground dark:text-gray-400 text-sm">
                  You can get your certificate of attendance <Link href="/members-dashboard/conference-evaluation" className="underline font-bold text-primary dark:text-primary-400">here</Link>
                </p>
              </div>

              {/* Virtual Event Section */}
              <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700 mb-6">
                <h2 className="text-md md:text-xl font-bold text-foreground dark:text-gray-100 mb-4">Join event for virtual attendees</h2>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <p className="text-muted-foreground dark:text-gray-400 text-sm">You can access the live event from here</p>
                  <Button variant='outline' className="bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors w-full sm:w-auto text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 ">
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
        </div>
        <p className="text-muted-foreground dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {conference.theme}
        </p>
        <div className="flex items-center text-muted-foreground text-xs mb-4">
          <Calendar className="w-3 h-3 mr-1 text-muted-foreground dark:text-gray-400" />
          <p className="text-muted-foreground dark:text-gray-400 text-sm line-clamp-2">{conference.date}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={() => onViewDetails(conference)}
          className="w-full bg-primary hover:bg-primary/90 px-3 text-gray-700 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const formatEventDate = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  };
  let formatted = date.toLocaleDateString('en-US', options);
  
  if (timeStr) {
    const time = new Date(`2000-01-01T${timeStr}`);
    formatted += ` • ${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return formatted;
};

const SeminarCard: React.FC<SeminarCardProps> = ({ seminar, onViewDetails }) => (
  <div className="rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card dark:border-gray-700 dark:hover:shadow-gray-700/30">
    <div className="p-4">
      <div className="flex items-start justify-between mb-3">
        <h2 className="text-gray-900 dark:text-gray-100 text-lg font-semibold line-clamp-2">
          {seminar.title}
        </h2>
        <span
          className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
            seminar?.status === "Completed"
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
          }`}
        >
          {seminar?.status}
        </span>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
        {seminar.theme}
      </p>
      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs mb-4">
        <Calendar className="w-3 h-3 mr-1 text-gray-600 dark:text-gray-400" />
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{seminar.date}</p>
      </div>
    </div>
    <div className="px-4 pb-4">
      <button
        onClick={() => onViewDetails(seminar)}
        className="w-full bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-gray-700 dark:text-gray-100 text-primary-foreground text-sm font-medium transition-colors"
      >
        View Details
      </button>
    </div>
  </div>
);

const SeminarDetailsView: React.FC<SeminarDetailsProps> = ({
  seminar,
  seminarDetails,
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

  if (!seminarDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-foreground dark:text-gray-100">Failed to load seminar details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to seminars
        </Button>
      </div>
     
      <div className="bg-card rounded-lg shadow-md overflow-hidden border dark:border-gray-700">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
              {seminar.title}
            </h1>
          </div>
          
          <div className="mb-4">
            <p className="text-lg sm:text-2xl text-gray-700 uppercase font-bold dark:text-gray-300">
              {seminar.theme}
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  {formatEventDate(seminarDetails.start_date, seminarDetails.start_time)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{seminar.venue}</p>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 mt-5">
            <EditSeminarModal 
              seminar={{
                id: seminar.id,
                title: seminar.title,
                theme: seminar.theme,
                venue: seminar.venue,
                start_date: seminarDetails.start_date,
                start_time: seminarDetails.start_time,
                status: seminar.status,
                speakers: seminarDetails.speakers || [],
                payments: seminarDetails.payments
              }}
              onSuccess={onEdit}
              trigger={
                <Button variant="outline" className="w-full sm:w-auto text-sm text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Seminar
                </Button>
              }
            />
            
            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <Button variant="outline" className="w-full sm:w-auto text-sm text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Seminar
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] max-w-[500px] w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <AlertDialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Delete Seminar
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-4 mb-6 text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this seminar? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <Button variant="outline" className="text-gray-900 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">
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
              className="w-full sm:w-auto text-sm text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
              onClick={() => onViewResources(seminar)}
            >
              View Resources
            </Button>
          </div>

          {/* Speakers Section */}
          {seminarDetails.speakers && seminarDetails.speakers.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.speakers.map((speaker, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-muted/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-muted">
                        <Image
                          src={speaker.picture || '/speakers/speaker_avatar.png'}
                          alt={speaker.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{speaker.name}</h3>
                        {speaker.portfolio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.portfolio}</p>
                        )}
                        {speaker.title && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{speaker.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Section */}
          {seminarDetails.resources && seminarDetails.resources.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Resources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.resources.map((resource) => (
                  <div key={resource.resource_id} className="bg-gray-50 dark:bg-muted/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col gap-4">
                      {resource.resource_type?.toLowerCase().includes('video') ? (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
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
                        <div className="flex items-center justify-center aspect-video rounded-lg bg-gray-100 dark:bg-gray-800">
                          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">{resource.caption}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resource.resource_type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resource.date}</p>
                        </div>
                        {!resource.resource_type?.toLowerCase().includes('video') && (
                          <a 
                            href={resource.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <FileText className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
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

const TrainingResources: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "details" | "resources">("list");
  const { data: session } = useSession();
  const bearerToken = session?.user?.token as string | undefined;

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`
      );
      const data = await response.json();
      if (data.status === "success") {
        const sortedSeminars = data.data.sort(
          (a: Seminar, b: Seminar) => {
            const yearA = a.title.match(/\d{4}/)?.[0] || "0";
            const yearB = b.title.match(/\d{4}/)?.[0] || "0";
            return parseInt(yearB) - parseInt(yearA);
          }
        );
        setSeminars(sortedSeminars);
        
        if (sortedSeminars.length > 0) {
          const latestSeminar = sortedSeminars[0];
          setSelectedSeminar(latestSeminar);
          fetchSeminarDetails(latestSeminar.id);
        }
      }
    } catch (error) {
      console.error("Error fetching seminars:", error);
      showToast.error("Failed to load seminars");
    } finally {
      setLoading(false);
    }
  };

  const fetchSeminarDetails = async (id: number) => {
    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch seminar details");
      }

      const data = await response.json();
      setSeminarDetails(data.data);
    } catch (error) {
      console.error("Error fetching seminar details:", error);
      showToast.error("Failed to load seminar details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteSeminar = async (seminarId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/delete_seminar/${seminarId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete seminar");
      }
  
      await fetchSeminars();
      showToast.success("Seminar deleted successfully");
      
      if (selectedSeminar?.id === seminarId) {
        setViewMode("list");
        setSelectedSeminar(null);
      }
    } catch (error) {
      console.error("Error deleting seminar:", error);
      showToast.error("Failed to delete seminar");
    }
  };

  const handleViewDetails = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setViewMode("details");
    fetchSeminarDetails(seminar.id);
  };

  const handleViewResources = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setViewMode("resources");
  };

  const handleBackToList = () => {
    setViewMode("list");
    if (seminars.length > 0) {
      setSelectedSeminar(seminars[0]);
      fetchSeminarDetails(seminars[0].id);
    }
  };

  useEffect(() => {
    fetchSeminars();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {viewMode === "details" && selectedSeminar ? (
        <SeminarDetailsView
          seminar={selectedSeminar}
          seminarDetails={seminarDetails}
          loading={detailsLoading}
          onBack={handleBackToList}
          onViewResources={handleViewResources}
          onEdit={() => fetchSeminarDetails(selectedSeminar.id)}
          onDelete={() => handleDeleteSeminar(selectedSeminar.id)}
        />
      ) : (
        <div className="space-y-8">
          {/* Add New Seminar Button */}
          <div className="flex justify-end">
            <AddFileModal onSuccess={fetchSeminars} />
          </div>

          {selectedSeminar && seminarDetails && (
            <div className="space-y-4">
              <SeminarDetailsView
                seminar={selectedSeminar}
                seminarDetails={seminarDetails}
                loading={detailsLoading}
                onBack={handleBackToList}
                onViewResources={handleViewResources}
                onEdit={() => fetchSeminarDetails(selectedSeminar.id)}
                onDelete={() => handleDeleteSeminar(selectedSeminar.id)}
              />
            </div>
          )}

          {seminars.length > 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Past Seminars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seminars.slice(1).map((seminar) => (
                  <SeminarCard
                    key={seminar.id}
                    seminar={seminar}
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

export default TrainingResources;