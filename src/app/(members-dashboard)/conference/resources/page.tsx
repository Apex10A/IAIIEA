"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  ArrowLeft,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Check,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";
import {
  Conference,
  ConferenceDetails,
} from "./interfaces";
import { ResourceCard, AddResourceModal } from "./components";
import { EventAgendaList } from "@/components/EventAgendaList";

// Carousel component for galleries, sponsors, and videos
const MediaCarousel = ({ items, type }: { items: any[], type: 'gallery' | 'sponsors' | 'videos' }) => {
  const safeItems = Array.isArray(items) ? items : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = type === 'videos' ? 1 : 3;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + itemsPerPage >= safeItems.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex - 1 < 0 ? Math.max(0, safeItems.length - itemsPerPage) : prevIndex - 1
    );
  };

  const visibleItems = safeItems.slice(currentIndex, currentIndex + itemsPerPage);

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
            {visibleItems.map((item, index) => {
              const src = typeof item === 'string' ? item : (item?.logo ?? item?.url ?? '');
              const alt = typeof item === 'string' ? 'Sponsor logo' : (item?.name ?? 'Sponsor');
              return (
                <div key={index} className="relative aspect-square w-full min-w-[300px] rounded-lg overflow-hidden bg-muted">
                  {src ? (
                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain p-6 grayscale hover:grayscale-0 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground ">
                      <FileText className="w-10 h-10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {type === 'videos' && visibleItems[0] && (
          <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
            {(() => {
              const v = visibleItems[0];
              const src = typeof v === 'string' ? v : (v?.url ?? v?.video ?? '');
              if (!src) {
                return (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                    <FileText className="w-12 h-12 text-gray-500 " />
                    <p className="text-gray-700 ">Video not available</p>
                  </div>
                );
              }
              return (
                <video src={src} className="w-full h-full object-cover" controls />
              );
            })()}
          </div>
        )}
      </div>
      
      {safeItems.length > itemsPerPage && (
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

interface ConferenceHubProps {
  conference: Conference;
  conferenceDetails: ConferenceDetails;
  participantCount: number;
  meals: Meal[];
  selectedMealId: number | null;
  isSelectingMeal: boolean;
  handleMealSelection: (mealId: number) => Promise<void>;
  conferences: Conference[];
  onBack: () => void;
  onSwitchConference: (conference: Conference) => void;
  onRefreshDetails: () => void;
}

export const ConferenceHub: React.FC<ConferenceHubProps> = ({
  conference,
  conferenceDetails,
  participantCount,
  meals,
  selectedMealId,
  isSelectingMeal,
  handleMealSelection,
  conferences,
  onBack,
  onSwitchConference,
  onRefreshDetails,
}) => {
  const isRegistered = conferenceDetails.is_registered;
  const registeredPlan = (conferenceDetails as ConferenceDetails & {
    registered_plan?: Record<string, string>;
    current_plan?: string;
    description?: string;
  }).registered_plan;
  const description = (conferenceDetails as ConferenceDetails & { description?: string }).description;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-fit flex items-center gap-2 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          All conferences
        </Button>

        {conferences.length > 1 && (
          <select
            value={conference.id}
            onChange={(e) => {
              const next = conferences.find((c) => c.id === Number(e.target.value));
              if (next) onSwitchConference(next);
            }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm"
          >
            {conferences.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative h-56 sm:h-72 bg-muted">
          {conferenceDetails.flyer ? (
            <Image
              src={conferenceDetails.flyer}
              alt={conference.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <FileText className="h-16 w-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  conference.status === "Completed"
                    ? "bg-amber-100 text-amber-800"
                    : conference.status === "Ongoing"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {conference.status}
              </span>
              {isRegistered && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <Check className="h-3 w-3" />
                  Registered
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
              <Users className="h-3.5 w-3.5" />
              {participantCount} registered
            </div>
          </div>
        </div>

        <div className="space-y-6 p-5 sm:p-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{conference.title}</h1>
            <p className="mt-2 text-base font-medium text-gray-600">{conference.theme}</p>
            {registeredPlan && (
              <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <Check className="h-3 w-3" />
                {Object.keys(registeredPlan)[0]} plan
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
              <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-[#203A87]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Date</p>
                <p className="text-sm font-medium text-gray-900">{conference.date}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-gray-50 p-4">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#203A87]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Venue</p>
                <p className="text-sm font-medium text-gray-900">{conference.venue}</p>
              </div>
            </div>
          </div>

          {!isRegistered ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-medium text-amber-900">
                Register for this conference to unlock the full agenda, speaker list, meals, and materials.
              </p>
              <Button asChild className="mt-4 bg-[#0E1A3D] text-white hover:bg-[#203A87]">
                <Link href={`/conference?id=${conference.id}`}>
                  Register on conference page
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {description && (
                <section>
                  <h2 className="mb-3 text-lg font-bold text-gray-900">About</h2>
                  <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">{description}</p>
                </section>
              )}

              <section className="rounded-xl border p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                    <Clock className="h-5 w-5 text-[#203A87]" />
                    Agenda
                  </h2>
                  <Button variant="outline" size="sm" className="w-fit shrink-0">
                    Download Proceedings
                  </Button>
                </div>
                <EventAgendaList agenda={conferenceDetails.agenda} showTitle={false} />
              </section>

              <section className="rounded-xl border p-5">
                <h2 className="mb-4 text-lg font-bold text-gray-900">Speakers</h2>
                {conferenceDetails.speakers?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {conferenceDetails.speakers.map((speaker, index) => (
                      <div key={index} className="flex flex-col items-center rounded-xl bg-gray-50 p-4 text-center">
                        {speaker.picture ? (
                          <Image
                            src={speaker.picture}
                            alt={speaker.name}
                            width={96}
                            height={96}
                            className="mb-3 rounded-full object-cover"
                          />
                        ) : (
                          <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
                            <Users className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                        {speaker.title && <p className="text-sm text-gray-600">{speaker.title}</p>}
                        {speaker.portfolio && <p className="text-xs text-gray-500">{speaker.portfolio}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">No speakers listed yet.</p>
                )}
              </section>

              <section className="rounded-xl border p-5">
                <h2 className="mb-2 text-lg font-bold text-gray-900">Meals</h2>
                <p className="mb-4 text-sm text-gray-600">Select your meal for the conference day.</p>
                {meals.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {meals.map((meal) => (
                      <div key={meal.id} className="relative h-52 overflow-hidden rounded-xl bg-muted">
                        {meal.image && (
                          <Image src={meal.image} alt={meal.meal} fill className="object-cover" />
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h3 className="mb-2 font-semibold text-white">{meal.meal}</h3>
                          <Button
                            size="sm"
                            variant={selectedMealId === meal.id ? "default" : "outline"}
                            className="bg-white/90 text-gray-900 hover:bg-white"
                            onClick={() => handleMealSelection(meal.id)}
                            disabled={isSelectingMeal}
                          >
                            {selectedMealId === meal.id ? "Selected ✓" : "Select meal"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-6 text-center text-sm text-muted-foreground">No meals available yet.</p>
                )}
              </section>

              <section className="rounded-xl border p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-bold text-gray-900">Conference materials</h2>
                  <AddResourceModal conferenceId={conference.id} onSuccess={onRefreshDetails} />
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Gallery</h3>
                    {conferenceDetails.gallery?.length > 0 ? (
                      <MediaCarousel items={conferenceDetails.gallery} type="gallery" />
                    ) : (
                      <p className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-500">No gallery images yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Sponsors</h3>
                    {conferenceDetails.sponsors?.length > 0 ? (
                      <MediaCarousel items={conferenceDetails.sponsors as any[]} type="sponsors" />
                    ) : (
                      <p className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-500">No sponsors listed yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Videos</h3>
                    {conferenceDetails.videos?.length > 0 ? (
                      <MediaCarousel items={conferenceDetails.videos as any[]} type="videos" />
                    ) : (
                      <p className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-500">No videos yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Documents</h3>
                    {conferenceDetails.resources?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {conferenceDetails.resources.map((resource) => (
                          <ResourceCard key={resource.resource_id} resource={resource} onDelete={() => {}} />
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-lg bg-gray-50 py-8 text-center text-sm text-gray-500">No documents uploaded yet.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-[#203A87]/20 bg-[#203A87]/5 p-5">
                <h2 className="mb-2 text-lg font-bold text-gray-900">Certificate</h2>
                <p className="text-sm text-gray-700">
                  Complete the evaluation to download your certificate of attendance.{" "}
                  <Link
                    href={`/members-dashboard/conference-evaluation?id=${conference.id}`}
                    className="font-semibold text-[#203A87] underline"
                  >
                    Get certificate
                  </Link>
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface ConferenceCardProps {
  conference: Conference;
  onViewConference: (conference: Conference) => void;
}

export const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onViewConference,
}) => {
  const statusClass =
    conference.status === "Completed"
      ? "bg-amber-100 text-amber-800"
      : conference.status === "Ongoing"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 bg-muted">
        {conference.flyer ? (
          <Image
            src={conference.flyer}
            alt={conference.title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <FileText className="h-10 w-10" />
          </div>
        )}
        <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}>
          {conference.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="line-clamp-2 text-lg font-bold text-gray-900">{conference.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm text-gray-600">{conference.theme}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-[#203A87]" />
            <span className="line-clamp-1">{conference.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0 text-[#203A87]" />
            <span className="line-clamp-1">{conference.venue}</span>
          </div>
        </div>

        <Button
          className="mt-5 w-full bg-[#0E1A3D] text-white hover:bg-[#203A87]"
          onClick={() => onViewConference(conference)}
        >
          View conference
        </Button>
      </div>
    </article>
  );
};

// Add interface for Meal
interface Meal {
  id: number; // normalized from meal_id
  image: string;
  meal: string; // normalized from name
}

const normalizeMeals = (raw: any[]): Meal[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((m: any) => ({
    id: m?.id ?? m?.meal_id ?? m?.mealId,
    image: m?.image ?? m?.url ?? '',
    meal: m?.meal ?? m?.name ?? 'Meal',
  })).filter((m) => m.id != null);
};

const ConferenceResources: React.FC = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "hub">("list");
  const [participantCount, setParticipantCount] = useState(0);
  const { data: session } = useSession();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [isSelectingMeal, setIsSelectingMeal] = useState(false);
  const hasLoadedRef = useRef(false);

  const getToken = () => session?.user?.token || session?.user?.userData?.token || "";

  const fetchConferenceDetails = useCallback(async (id: number) => {
    const token = getToken();
    if (!token) return;

    try {
      setDetailsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data?.message || "Failed to fetch conference details");
      }

      const raw = data.data || {};
      const normalized: ConferenceDetails = {
        ...raw,
        is_registered: !!raw.is_registered,
        gallery: Array.isArray(raw.gallery) ? raw.gallery : (Array.isArray(raw?.media?.gallery) ? raw.media.gallery : []),
        sponsors: Array.isArray(raw.sponsors) ? raw.sponsors : (Array.isArray(raw?.media?.sponsors) ? raw.media.sponsors : []),
        videos: Array.isArray(raw.videos) ? raw.videos : (Array.isArray(raw?.media?.videos) ? raw.media.videos : []),
        resources: Array.isArray(raw.resources) ? raw.resources : [],
        speakers: Array.isArray(raw.speakers) ? raw.speakers : [],
        agenda: typeof raw.agenda === "string" ? raw.agenda : "",
        schedule: Array.isArray(raw.schedule) ? raw.schedule : [],
        meals: Array.isArray(raw.meals) ? raw.meals : [],
      };
      setConferenceDetails(normalized);
    } catch (error) {
      console.error("Error fetching conference details:", error);
      showToast.error("Failed to load conference details");
    } finally {
      setDetailsLoading(false);
    }
  }, [session?.user?.token, session?.user?.userData?.token]);

  const fetchParticipantCount = useCallback(async (conferenceId: number) => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/user_list/conference_member/${conferenceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) return;
      const data = await response.json();
      setParticipantCount(Array.isArray(data.data) ? data.data.length : 0);
    } catch (err) {
      console.error("Error fetching participant count:", err);
    }
  }, [session?.user?.token, session?.user?.userData?.token]);

  const fetchConferences = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
      const data = await response.json();
      if (data.status === "success") {
        const sortedConferences = [...data.data].sort((a: Conference, b: Conference) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        setConferences(sortedConferences);
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      showToast.error("Failed to load conferences");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMeals = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/list_meal`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === "success") {
        setMeals(normalizeMeals(data.data));
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    }
  }, [session?.user?.token, session?.user?.userData?.token]);

  const openConference = (conference: Conference) => {
    setSelectedConference(conference);
    setViewMode("hub");
    fetchConferenceDetails(conference.id);
    fetchParticipantCount(conference.id);
  };

  const handleBackToList = () => {
    setViewMode("list");
  };

  const handleSwitchConference = (conference: Conference) => {
    openConference(conference);
  };

  const handleMealSelection = async (mealId: number) => {
    setIsSelectingMeal(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/SelectMeal`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meal_id: mealId }),
      });

      const data = await response.json();
      if (data.status === "success") {
        setSelectedMealId(mealId);
        showToast.success("Meal selected successfully");
      } else {
        showToast.error(data?.message || "Failed to select meal");
      }
    } catch (error) {
      console.error("Error selecting meal:", error);
      showToast.error("Failed to select meal");
    } finally {
      setIsSelectingMeal(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token || hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    fetchConferences();
    fetchMeals();
  }, [session?.user?.token, session?.user?.userData?.token, fetchConferences, fetchMeals]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#203A87]" />
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Conferences</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Browse IAIIEA conferences. Open a conference to see the agenda, speakers, meals, and materials in one place.
          </p>
        </div>

        {conferences.length === 0 ? (
          <div className="rounded-2xl border bg-white p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-4 font-medium text-gray-900">No conferences yet</p>
            <p className="mt-1 text-sm text-gray-500">Check back when a new conference is published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {conferences.map((conference) => (
              <ConferenceCard
                key={conference.id}
                conference={conference}
                onViewConference={openConference}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (detailsLoading || !selectedConference || !conferenceDetails) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#203A87]" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <ConferenceHub
        conference={selectedConference}
        conferenceDetails={conferenceDetails}
        participantCount={participantCount}
        meals={meals}
        selectedMealId={selectedMealId}
        isSelectingMeal={isSelectingMeal}
        handleMealSelection={handleMealSelection}
        conferences={conferences}
        onBack={handleBackToList}
        onSwitchConference={handleSwitchConference}
        onRefreshDetails={() => fetchConferenceDetails(selectedConference.id)}
      />
    </div>
  );
};

export default ConferenceResources;