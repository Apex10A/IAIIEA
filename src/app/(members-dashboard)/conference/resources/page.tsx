"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Trash2,
  Calendar,
  MapPin,
  Tag,
  ArrowLeft,
  ExternalLink,
  Play,
  Download,
  FileText,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  FileUp
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";

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
  description: string;
  status: string;
  meals: string[];
  gallery: string[];
  flyer: string;
  sponsors: string[];
  videos: string[];
  resources: Resource[];
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
  resources: {
    resource_id: number;
    resource_type: string | null;
    caption: string;
    date: string;
    file: string;
  }[];
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
  payments: {
    early_bird_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    normal_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    late_registration: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    tour: {
      virtual: {
        usd: number | string;
        naira: number | string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    annual_dues: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    vetting_fee: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
    publication_fee: {
      virtual: {
        usd: string;
        naira: string;
      };
      physical: {
        usd: string;
        naira: string;
      };
    };
  };
}

interface ResourceCardProps {
  resource: Resource;
  onDelete: (resourceId: number) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDelete = async () => {
    try {
      await onDelete(resource.resource_id);
      showToast.success("Resource deleted successfully");
    } catch (error) {
      showToast.error("Failed to delete resource");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {resource.caption}
            </h3>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            Added on {formatDate(resource.date)}
          </p>
          {resource.file && (
            <a
              href={resource.file}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 transition-colors"
            >
              <Download className="w-3 h-3 mr-1.5" />
              Download
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

interface AddResourceModalProps {
  conferenceId: number;
  onSuccess: () => void;
}

const AddResourceModal: React.FC<AddResourceModalProps> = ({
  conferenceId,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !caption) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("conference_id", conferenceId.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add_resource`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add resource");
      }

      showToast.success("Resource added successfully");
      setOpen(false);
      onSuccess();
    } catch (error) {
      console.error("Error adding resource:", error);
      showToast.error("Failed to add resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-white rounded-lg shadow-lg p-6 focus:outline-none">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold">
              Add New Resource
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <Cross2Icon className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource File
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="text-sm text-gray-600">
                        {file.name} ({Math.round(file.size / 1024)} KB)
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center">
                          <FileUp className="w-12 h-12 text-gray-400" />
                        </div>
                        <div className="flex text-sm text-gray-600">
                          <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                            <span>Upload a file</span>
                            <input
                              type="file"
                              className="sr-only"
                              onChange={(e) =>
                                setFile(e.target.files?.[0] || null)
                              }
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOCX, PPTX up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor="caption"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Caption
                </label>
                <input
                  type="text"
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading || !file || !caption}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Uploading..." : "Upload Resource"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

interface ConferenceDetailsProps {
  conference: Conference;
  conferenceDetails: ConferenceDetails | null;
  loading: boolean;
  onBack: () => void;
  onViewResources: (conference: Conference) => void;
}

const ConferenceDetailsView: React.FC<ConferenceDetailsProps> = ({
  conference,
  conferenceDetails,
  loading,
  onBack,
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
      {/* <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to conferences
      </button> */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* <div className="relative h-[400px] bg-gray-100">
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
        </div> */}

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {conference.title}
          </h1>
          <p className="text-gray-800 ">171 people have registered for this conference</p>
          </div>
          <p className="text-2xl text-gray-800 uppercase font-bold mb-4">
            {conference.theme}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-5">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {conference.date}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Venue</p>
                <p className="font-medium">{conference.venue}</p>
              </div>
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

          {conferenceDetails.is_registered && (
            <div className="space-y-4">
              {conferenceDetails?.schedule && conferenceDetails.schedule.length > 0 && (
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection("schedule")}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                  >
                    <span>Schedule</span>
                    {expandedSection === "schedule" ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {expandedSection === "schedule" && (
                    <div className="mt-4 space-y-4">
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
                  )}
                </div>
              )}

              {conferenceDetails?.payments && (
                <div className="border-b border-gray-200 pb-4">
                  <button
                    onClick={() => toggleSection("payments")}
                    className="flex justify-between items-center w-full text-left font-medium text-gray-900"
                  >
                    <span>Payment Information</span>
                    {expandedSection === "payments" ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  {expandedSection === "payments" && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(conferenceDetails.payments).map(
                        ([category, types], index) => (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-sm mb-2 capitalize">
                              {category.replace(/_/g, " ")}
                            </h3>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Virtual:</span>
                                <span>
                                  ${types.virtual.usd} / NGN {types.virtual.naira}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Physical:</span>
                                <span>
                                  ${types.physical.usd} / NGN {types.physical.naira}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}
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
                      className="object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No gallery images available</p>
            )}
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

interface ConferenceCardProps {
  conference: Conference;
  onViewResources: (conference: Conference) => void;
  onViewDetails: (conference: Conference) => void;
}

const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onViewResources,
  onViewDetails,
}) => {
  const resourceCount = conference.resources?.length || 0;

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
          <span>{conference.date}</span>
        </div>
      </div>
      <div className="px-4 pb-4 grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewDetails(conference)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md text-white text-sm font-medium transition-colors"
        >
          View Details
        </button>
        <button
          onClick={() => onViewResources(conference)}
          className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-gray-700 text-sm font-medium transition-colors"
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