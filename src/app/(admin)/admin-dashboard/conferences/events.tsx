import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2, Calendar, MapPin, Tag, ArrowLeft, ExternalLink } from "lucide-react";
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

interface Meal {
  meal_id: number;
  name: string;
  image: string;
}

interface Schedule {
  schedule_id: number;
  day: string;
  activity: string;
  facilitator: string;
  start: string;
  end: string;
  venue: string;
  posted: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  start_date: string;
  start_time: string;
  sub_theme: string[];
  work_shop: string[];
  important_date: string[];
  status: string;
  gallery: string[];
  flyer: string;
  sponsors: string[];
  videos: string[];
  resources: Resource[];
  schedule: Schedule[];
  meals: Meal[];
  is_registered: boolean;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Conference;
}

interface ConferenceCardProps {
  conference: Conference;
  onViewResources: (conference: Conference) => void;
  onViewDetails: (conference: Conference) => void;
  onDeleteConference: (id: number) => void;
  onEditConference: (conference: Conference) => void;
}

// Conference Card Component
const ConferenceCard: React.FC<ConferenceCardProps> = ({
  conference,
  onViewResources,
  onViewDetails,
  onDeleteConference,
  onEditConference,
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
    <div className="rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="absolute z-20 bottom-5 left-5">
          <button
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
              conference?.status === "Completed"
                ? "bg-[#f2e9c3] text-[#0B142F] hover:bg-[#e9dba3]"
                : "bg-[#203A87] text-white hover:bg-[#152a61]"
            }`}
          >
            {conference.status}
          </button>
        </div>
        <Image
          src={conference.flyer || "/Meeting.png"}
          alt={conference.title}
          width={600}
          height={400}
          className="w-full h-[250px] object-cover"
        />
      </div>
      <div className="p-4">
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
                Are you sure you want to delete this conference? This action
                cannot be undone.
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

// Resource Card Component
interface ResourceCardProps {
  resource: Resource;
  onDelete: (resourceId: number) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onDelete }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">
            {resource.caption}
          </h3>
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
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

// Conference Details Component
interface ConferenceDetailsProps {
  conferenceId: number;
  onBack: () => void;
  onViewResources: (conference: Conference) => void;
}

const ConferenceDetails: React.FC<ConferenceDetailsProps> = ({
  conferenceId,
  onBack,
  onViewResources,
}) => {
  const { data: session } = useSession();
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      if (!bearerToken || !conferenceId) return;
      
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conferenceId}`,
          {
            headers: {
              Authorization: `Bearer ${bearerToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch conference details");
        }

        const result: ApiResponse = await response.json();
        
        if (result.status === "success" && result.data) {
          setConference(result.data);
        } else {
          throw new Error(result.message || "Failed to load conference data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        showToast.error("Failed to load conference details");
      } finally {
        setLoading(false);
      }
    };

    fetchConferenceDetails();
  }, [conferenceId, bearerToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px]">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Conference</h2>
        <p className="text-gray-700 mb-6">{error || "Conference data not available"}</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-[#203A87] text-white rounded-lg hover:bg-[#152a61] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main Content */}
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
            src={conference.flyer || "/Meeting.png"}
            alt={conference.title}
            width={800}
            height={400}
            className="w-full h-[300px] md:h-[400px] object-cover"
          />
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-gray-700 text-base md:text-lg leading-relaxed">
              {conference.title}
            </h1>
            {conference.is_registered && (
              <p className="text-sm">
                <span className="font-semibold">Registered</span> • {" "}
                <a href="#" className="underline font-bold text-blue-600 hover:text-blue-800">
                  Access participant directory
                </a>
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 md:p-6 rounded-lg mb-6">
            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0B142F] mb-4">
              {conference.theme}
            </p>
          </div>
          
          {/* Sub Themes */}
          {conference.sub_theme && conference.sub_theme.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Sub Themes</h2>
              <ul className="list-disc pl-5 space-y-2">
                {conference.sub_theme.map((theme, index) => (
                  <li key={index} className="text-gray-700">{theme}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mb-6">
            <hr />
          </div>
          
          {/* Date and Venue */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#203A87] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                <p className="text-base md:text-lg font-medium text-[#0B142F]">
                  {conference.date}
                </p>
                {conference.start_date && conference.start_time && (
                  <p className="text-sm text-gray-600">
                    Starts on {formatDate(conference.start_date)} at {conference.start_time}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#203A87] mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-500">Venue</h3>
                <p className="text-base md:text-lg font-medium text-[#0B142F]">
                  {conference.venue}
                </p>
              </div>
            </div>
          </div>
          
          {/* Important Dates */}
          {conference.important_date && conference.important_date.length > 0 && (
            <>
              <div className="my-6">
                <hr />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Important Dates</h2>
                <ul className="space-y-2">
                  {conference.important_date
                    .filter(date => date.trim() !== "4 ")
                    .map((date, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="text-[#203A87]">•</span>
                        <span>{date.substring(date.indexOf(' ') + 1)}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </>
          )}
          
          {/* Workshops */}
          {conference.work_shop && conference.work_shop.length > 0 && (
            <>
              <div className="my-6">
                <hr />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-3">Workshops</h2>
                <ul className="space-y-2">
                  {conference.work_shop.map((workshop, index) => (
                    <li key={index} className="flex gap-2">
                      <span className="text-[#203A87]">•</span>
                      <span>{workshop}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          
          {/* Resources Section */}
          <div className="my-6">
            <hr />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Resources</h2>
            <p className="mb-4">
              View {" "}
              <a href="#" className="underline font-bold text-blue-600 hover:text-blue-800">
                Conference proceedings
              </a>
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="text-gray-700">Get the conference resources by each speaker here</p>
              <button 
                onClick={() => onViewResources(conference)}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 text-white bg-[#203A87] hover:bg-[#152a61]"
              >
                Resources
              </button>
            </div>
          </div>
          
          {/* Schedule Section */}
          <div className="my-6">
            <hr />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Daily Conference Schedule</h2>
            {conference.schedule && conference.schedule.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 border text-left">Day</th>
                      <th className="py-2 px-4 border text-left">Activity</th>
                      <th className="py-2 px-4 border text-left">Facilitator</th>
                      <th className="py-2 px-4 border text-left">Venue</th>
                      <th className="py-2 px-4 border text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conference.schedule.map((item) => (
                      <tr key={item.schedule_id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{item.day}</td>
                        <td className="py-2 px-4 border">{item.activity}</td>
                        <td className="py-2 px-4 border">{item.facilitator}</td>
                        <td className="py-2 px-4 border">{item.venue}</td>
                        <td className="py-2 px-4 border">
                          {formatDate(item.start)} - {formatDate(item.end)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No schedule available yet</p>
            )}
          </div>
          
          {/* Meal Ticketing */}
          <div className="my-6">
            <hr />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Meal Ticketing</h2>
            <p className="mb-4">These are the meals currently available. Select any meal of your choice.</p>
            {conference.meals && conference.meals.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {conference.meals.map((meal) => (
                  <div key={meal.meal_id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm">
                    <div className="relative h-40">
                      <Image
                        src={meal.image}
                        alt={meal.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-center">{meal.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No meals available yet</p>
            )}
          </div>
          
          {/* Virtual Access */}
          <div className="my-6">
            <hr />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Join Event (Virtual Attendees)</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <p className="text-gray-700">You can access the live event from here</p>
              <button className="px-4 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 text-white bg-[#203A87] hover:bg-[#152a61] flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Join Meeting
              </button>
            </div>
          </div>
          
          {/* Certification */}
          <div className="my-6">
            <hr />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">Certification</h2>
            <p>
              Complete the conference evaluation to{" "}
              <a href="#" className="underline font-bold text-blue-600 hover:text-blue-800">
                access certificate
              </a>
            </p>
          </div>
        </div>
      </div>
      
      {/* Sidebar Content */}
      <div className="bg-white rounded-lg shadow-lg border p-6">
        {/* Gallery */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Gallery</h2>
          {conference.gallery && conference.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {conference.gallery.map((imageUrl, index) => (
                <div key={index} className="relative h-40 rounded-lg overflow-hidden shadow-sm">
                  <Image
                    src={imageUrl}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No gallery images available</p>
          )}
        </div>
        
        {/* Papers */}
        <div className="my-6">
          <hr />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Conference Papers</h2>
          <p className="text-gray-500">Papers will be available after submission deadline</p>
        </div>
        
        {/* Conference Flyer */}
        <div className="my-6">
          <hr />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Conference Flyer</h2>
          {conference.flyer ? (
            <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-sm">
              <Image
                src={conference.flyer}
                alt="Conference Flyer"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <p className="text-gray-500">No flyer available</p>
          )}
        </div>
        
        {/* Sponsors */}
        {conference.sponsors && conference.sponsors.length > 0 && (
          <>
            <div className="my-6">
              <hr />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Sponsors</h2>
              <div className="grid grid-cols-2 gap-4">
                {conference.sponsors.map((sponsor, index) => (
                  <div key={index} className="relative h-32 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                    <Image
                      src={sponsor}
                      alt={`Sponsor ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        
        {/* Conference Videos */}
        <div className="my-6">
          <hr />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3">Conference Videos</h2>
          {conference.videos && conference.videos.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {conference.videos.map((video, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden shadow-sm">
                  <iframe
                    src={video}
                    className="w-full h-48"
                    allowFullScreen
                    title={`Conference video ${index + 1}`}
                  ></iframe>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No videos available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { ConferenceCard, ResourceCard, ConferenceDetails };