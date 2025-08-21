"use client"

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";

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

// Simple media carousel used across sections
const MediaCarousel = ({ items, type }: { items: any[]; type: "gallery" | "sponsors" | "videos" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = type === "videos" ? 1 : 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerPage >= items.length ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 < 0 ? Math.max(0, items.length - itemsPerPage) : prevIndex - 1));
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="relative">
      <div className="flex overflow-hidden">
        {type === "gallery" && (
          <div className="flex gap-4 transition-transform duration-300">
            {visibleItems.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square w-full min-w-[300px] rounded-lg overflow-hidden bg-muted">
                <Image src={imageUrl} alt={`Gallery image ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
        {type === "sponsors" && (
          <div className="flex gap-4 transition-transform duration-300">
            {visibleItems.map((sponsor, index) => (
              <div key={index} className="relative aspect-square w-full min-w-[300px] rounded-lg overflow-hidden bg-muted">
                <Image src={sponsor.logo} alt={sponsor.name} fill className="object-contain p-4" />
                <div className="absolute bottom-0 left-0 right-0 bg-background/90 p-2 text-center dark:bg-gray-800/90">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{sponsor.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {type === "videos" && visibleItems[0] && (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {visibleItems[0].type === "video" ? (
              <video src={visibleItems[0].url} className="w-full h-full object-cover" controls />
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

// Details view for a single seminar
const SeminarDetailsView: React.FC<{
  seminar: Seminar;
  seminarDetails: SeminarDetails | null;
  loading: boolean;
  onBack: () => void;
}> = ({ seminar, seminarDetails, loading, onBack }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!seminarDetails) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p className="text-foreground dark:text-gray-100">Failed to load seminar details</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to seminars
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-lg overflow-hidden border dark:border-gray-700">
        <div className="relative h-64 sm:h-[400px] bg-gradient-to-tr from-primary/10 to-purple-300/20">
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{seminar.title}</h1>
          </div>

          <div className="mb-4">
            <p className="text-lg sm:text-2xl text-gray-700 uppercase font-bold dark:text-gray-300">{seminar.theme}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{seminar.date}</p>
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
                    <Image src={speaker.picture} alt={speaker.name} width={150} height={150} className="rounded-full mb-4" />
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
                  <div key={resource.resource_id} className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow transition-shadow">
                    <h4 className="font-semibold mb-2">{resource.caption}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Added: {new Date(resource.date).toLocaleDateString()}</p>
                    {resource.file && (
                      <a
                        href={resource.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/90 text-sm font-semibold"
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
  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { data: session } = useSession();
  const bearerToken = (session as any)?.user?.token || (session as any)?.user?.userData?.token;

  // Fetch seminars
  const fetchSeminars = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`);
      const data = await response.json();
      if (data.status === "success") {
        const sortedSeminars: Seminar[] = data.data.sort((a: Seminar, b: Seminar) => {
          const yearA = new Date(a.date).getFullYear();
          const yearB = new Date(b.date).getFullYear();
          return yearB - yearA;
        });
        setSeminars(sortedSeminars);
        if (sortedSeminars.length > 0) {
          setSelectedSeminar(sortedSeminars[0]);
          setSelectedYear(new Date(sortedSeminars[0].date).getFullYear());
          fetchSeminarDetails(sortedSeminars[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching seminars:", error);
      showToast.error("Failed to load seminars");
    } finally {
      setLoading(false);
    }
  };

  // Fetch seminar details
  const fetchSeminarDetails = async (id: number) => {
    setDetailsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${id}`, {
        headers: { Authorization: `Bearer ${bearerToken}` },
      });
      const data = await response.json();
      if (data.status === "success") {
        setSeminarDetails(data.data);
      }
    } catch (error) {
      console.error("Error fetching seminar details:", error);
      showToast.error("Failed to load seminar details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    fetchSeminarDetails(seminar.id);
    const yr = new Date(seminar.date).getFullYear();
    setSelectedYear(yr);
  };

  const years = useMemo(() => {
    const ys = Array.from(new Set(seminars.map((s) => new Date(s.date).getFullYear())));
    return ys.sort((a, b) => b - a);
  }, [seminars]);

  const filteredSeminars = useMemo(() => {
    const query = search.trim().toLowerCase();
    return seminars.filter((s) => {
      const matchesYear = selectedYear ? new Date(s.date).getFullYear() === selectedYear : true;
      const matchesQuery = query
        ? s.title.toLowerCase().includes(query) || s.theme.toLowerCase().includes(query)
        : true;
      return matchesYear && matchesQuery;
    });
  }, [seminars, search, selectedYear]);

  useEffect(() => {
    fetchSeminars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const otherSeminars = filteredSeminars.filter((s) => s.id !== selectedSeminar?.id);

  return (
    <div className="container mx-auto py-6 sm:py-8">
      {/* Hero header */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-primary to-purple-600 p-6 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.12),transparent_35%)]" />
        <div className="relative z-10">
          <p className="text-white/90 text-sm mb-1">Members Training Hub</p>
          <h1 className="text-2xl sm:text-3xl font-bold">Explore seminars, speakers and downloadable resources</h1>
          <p className="mt-2 text-white/80 max-w-2xl">
            Stay updated with the latest IAIIEA seminars. Browse past events and access materials crafted for members.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="bg-white/15 rounded-full px-3 py-1">Total seminars: {seminars.length}</span>
            {selectedYear && <span className="bg-white/15 rounded-full px-3 py-1">Year: {selectedYear}</span>}
            {seminarDetails && (
              <span className="bg-white/15 rounded-full px-3 py-1">Resources: {seminarDetails.resources.length}</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by title or theme..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {years.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {years.map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  selectedYear === yr
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground hover:bg-muted border-border"
                }`}
              >
                {yr}
              </button>
            ))}
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                selectedYear === null
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground hover:bg-muted border-border"
              }`}
            >
              All years
            </button>
          </div>
        )}
      </div>

      {/* Selected seminar details */}
      {selectedSeminar && seminarDetails ? (
        <SeminarDetailsView
          seminar={selectedSeminar}
          seminarDetails={seminarDetails}
          loading={detailsLoading}
          onBack={() => {
            // scroll back to controls
            const el = document?.body;
            if (el) window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      ) : (
        <div className="flex justify-center items-center min-h-[30vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Browse other seminars */}
      <div className="space-y-4 mt-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse Seminars</h2>

        {otherSeminars.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
            <p>No seminars match your filters. Try adjusting the search or year.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherSeminars.map((seminar) => (
              <div
                key={seminar.id}
                className="rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all overflow-hidden bg-card dark:border-gray-700"
              >
                <div className="relative">
                  <div className="absolute z-20 bottom-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full font-medium text-xs transition-colors duration-300 ${
                        seminar?.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                      }`}
                    >
                      {seminar?.status}
                    </span>
                  </div>
                  <div className="h-44 w-full bg-gradient-to-tr from-muted to-muted/70 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.05),transparent_35%)]" />
                    <div className="flex items-center justify-center h-full text-muted-foreground dark:text-gray-400">
                      <FileText className="w-12 h-12" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-foreground text-gray-900 dark:text-gray-100 text-lg font-semibold line-clamp-2">
                      {seminar.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-400 text-sm mb-3 line-clamp-2">{seminar.theme}</p>
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
        )}
      </div>
    </div>
  );
};

export default TrainingResources;
