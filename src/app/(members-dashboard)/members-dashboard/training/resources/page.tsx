"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Trash2,
  Calendar,
  MapPin,
  ArrowLeft,
  FileText,
  Loader2,
  Plus,
  Pencil,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";

interface Speaker {
  name: string;
  title: string;
  picture: string;
}

interface Resource {
  resource_id: number;
  resource_type: string | null;
  caption: string;
  date: string;
  file: string;
}

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

interface SeminarDetails {
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
  speakers: Speaker[];
  resources: Resource[];
  gallery?: string[];
  sponsors?: { logo: string; name: string }[];
  videos?: { url: string; type: string }[];
}

// Carousel for gallery, sponsors, videos
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
                  <p className="font-medium text-gray-900 dark:text-gray-100">{sponsor.name}</p>
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
                <FileText className="w-12 h-12 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-700 dark:text-gray-400">Video not available</p>
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
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 p-2 rounded-full shadow hover:bg-background dark:bg-gray-800/80 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );
};

// Seminar Details View Component
const SeminarDetailsView: React.FC<{ seminar: Seminar; seminarDetails: SeminarDetails | null; loading: boolean; onBack: () => void }> = ({ seminar, seminarDetails, loading, onBack }) => {
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
        <div className="relative h-64 sm:h-[400px] bg-muted">
          {seminarDetails?.gallery && seminarDetails.gallery.length > 0 ? (
            <MediaCarousel items={seminarDetails.gallery} type="gallery" />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground dark:text-gray-400">
              <FileText className="w-16 h-16" />
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 rounded-full text-sm font-medium dark:bg-gray-800 dark:text-gray-200">
            {seminar.status}
          </div>
        </div>
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
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  {seminar.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{seminar.venue}</p>
              </div>
            </div>
          </div>
          {/* Sub-themes */}
          {seminarDetails.sub_theme.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Sub-themes</h3>
              <ul className="list-disc list-inside space-y-2">
                {seminarDetails.sub_theme.map((theme, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{theme}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Workshops */}
          {seminarDetails.work_shop.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Workshops</h3>
              <ul className="list-disc list-inside space-y-2">
                {seminarDetails.work_shop.map((workshop, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">{workshop}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Speakers */}
          {seminarDetails.speakers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Speakers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.speakers.map((speaker, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                    <Image
                      src={speaker.picture}
                      alt={speaker.name}
                      width={150}
                      height={150}
                      className="rounded-full mb-4"
                    />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{speaker.name}</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400">{speaker.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Resources */}
          {seminarDetails.resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.resources.map((resource) => (
                  <div key={resource.resource_id} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">{resource.caption}</h4>
                    <p className="text-sm text-gray-600 mb-3">Added: {new Date(resource.date).toLocaleDateString()}</p>
                    {resource.file && (
                      <a
                        href={resource.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                      >
                        Download Resource
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Gallery */}
          {seminarDetails.gallery && seminarDetails.gallery.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Gallery</h2>
              <MediaCarousel items={seminarDetails.gallery} type="gallery" />
            </div>
          )}
          {/* Sponsors */}
          {seminarDetails.sponsors && seminarDetails.sponsors.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sponsors</h2>
              <MediaCarousel items={seminarDetails.sponsors} type="sponsors" />
            </div>
          )}
          {/* Videos */}
          {seminarDetails.videos && seminarDetails.videos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Videos</h2>
              <MediaCarousel items={seminarDetails.videos} type="videos" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TrainingResources: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [seminarDetails, setSeminarDetails] = useState<SeminarDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch seminars
  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
      const data = await response.json();
      if (data.status === "success") {
        const sortedSeminars = data.data.sort((a: Seminar, b: Seminar) => {
          const yearA = new Date(a.date).getFullYear();
          const yearB = new Date(b.date).getFullYear();
          return yearB - yearA;
        });
        setSeminars(sortedSeminars);
        if (sortedSeminars.length > 0) {
          setSelectedSeminar(sortedSeminars[0]);
          fetchSeminarDetails(sortedSeminars[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching seminars:', error);
      showToast.error('Failed to load seminars');
    } finally {
      setLoading(false);
    }
  };

  // Fetch seminar details
  const fetchSeminarDetails = async (id: number) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setSeminarDetails(data.data);
      }
    } catch (error) {
      console.error('Error fetching seminar details:', error);
      showToast.error('Failed to load seminar details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    fetchSeminarDetails(seminar.id);
  };

  const handleBackToList = () => {
    if (seminars.length > 0) {
      setSelectedSeminar(seminars[0]);
      fetchSeminarDetails(seminars[0].id);
    }
  };

  useEffect(() => {
    fetchSeminars();
    // eslint-disable-next-line
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
      {selectedSeminar && seminarDetails ? (
        <>
          <SeminarDetailsView
            seminar={selectedSeminar}
            seminarDetails={seminarDetails}
            loading={detailsLoading}
            onBack={handleBackToList}
          />
          {seminars.length > 1 && (
            <div className="space-y-4 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Past Seminars</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {seminars.slice(1).map((seminar) => (
                  <div key={seminar.id} className="rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow overflow-hidden bg-card dark:border-gray-700 dark:hover:shadow-gray-700/30">
                    <div className="relative group">
                      <div className="absolute z-20 bottom-5 left-5">
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
                      <div className="h-48 w-full bg-muted relative overflow-hidden">
                        {/* You can add a seminar image here if available */}
                        <div className="flex items-center justify-center h-full text-muted-foreground dark:text-gray-400">
                          <FileText className="w-12 h-12" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h2 className="text-foreground text-gray-900 dark:text-gray-100 text-lg font-semibold line-clamp-2">
                          {seminar.title}
                        </h2>
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {seminar.theme}
                      </p>
                      <div className="flex items-center text-gray-700 text-xs mb-4">
                        <Calendar className="w-3 h-3 mr-1 text-gray-500 dark:text-gray-400" />
                        <p className="text-gray-700 dark:text-gray-400 text-sm line-clamp-2">{seminar.date}</p>
                      </div>
                    </div>
                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleViewDetails(seminar)}
                        className="w-full bg-primary hover:bg-primary/90 px-3 py-2 rounded-md text-primary-foreground text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};

export default TrainingResources;
