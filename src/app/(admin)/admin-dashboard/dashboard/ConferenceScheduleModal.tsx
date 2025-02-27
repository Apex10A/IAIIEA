import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showToast } from '@/utils/toast';

interface ConferenceScheduleModalProps {
  onScheduleAdded: () => void;
}

interface ScheduleDetails {
  event_id: string;
  day: string;
  start: string;
  end: string;
  activity: string;
  venue: string;
  facilitator: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

const ConferenceScheduleModal: React.FC<ConferenceScheduleModalProps> = ({ onScheduleAdded }) => {
  const [scheduleDetails, setScheduleDetails] = useState<ScheduleDetails>({
    event_id: "",
    day: "",
    start: "",
    end: "",
    activity: "",
    venue: "",
    facilitator: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingConferences, setIsFetchingConferences] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch conferences when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchConferences();
    }
  }, [isOpen]);

  const fetchConferences = async () => {
    try {
      setIsFetchingConferences(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conferences: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        setConferences(result.data);
        // Set default selection to the first conference if available
        if (result.data.length > 0) {
          setScheduleDetails(prev => ({
            ...prev,
            event_id: result.data[0].id.toString()
          }));
        }
      } else {
        throw new Error(result.message || "Failed to fetch conferences");
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      let errorMessage = "Failed to load conferences";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      showToast.error(errorMessage);
    } finally {
      setIsFetchingConferences(false);
    }
  };

  const validateDates = () => {
    const startDate = new Date(scheduleDetails.start);
    const endDate = new Date(scheduleDetails.end);
    return startDate <= endDate;
  };

  const handleInputChange = (field: keyof ScheduleDetails, value: string) => {
    setError(""); // Clear any previous errors
    setScheduleDetails((prev) => ({ ...prev, [field]: value }));

    // If conference selection changes, update the venue with the conference venue
    if (field === "event_id") {
      const selectedConference = conferences.find(conf => conf.id.toString() === value);
      if (selectedConference) {
        // Optionally pre-fill the venue with the conference venue
        // Comment or remove this if you don't want this behavior
        setScheduleDetails(prev => ({
          ...prev,
          venue: selectedConference.venue
        }));
      }
    }
  };

  const resetForm = () => {
    // If conferences exist, set the default event_id to the first one
    const defaultEventId = conferences.length > 0 ? conferences[0].id.toString() : "";
    
    setScheduleDetails({
      event_id: defaultEventId,
      day: "",
      start: "",
      end: "",
      activity: "",
      venue: "",
      facilitator: "",
    });
    setError("");
  };

  const handleSubmit = async () => {
    try {
      // Validate all required fields
      const requiredFields: (keyof ScheduleDetails)[] = [
        "event_id",
        "day",
        "start",
        "end",
        "activity",
        "venue",
        "facilitator",
      ];
      const missingFields = requiredFields.filter(field => !scheduleDetails[field]);
      
      if (missingFields.length > 0) {
        showToast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      // Validate dates
      if (!validateDates()) {
        showToast.error("End date cannot be before start date");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/add_conference_schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify(scheduleDetails),
      });

      if (!response.ok) {
        throw new Error(`Failed to create schedule: ${response.statusText}`);
      }
   
      const result = await response.json();
      
      if (result.status === "success") {
        showToast.success('Schedule added successfully!');
        if (onScheduleAdded) {
          onScheduleAdded();
        }
        setIsOpen(false);
        resetForm();
      } else {
        throw new Error(result.message || "Failed to create schedule");
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        showToast.error(error.message);
      } else {
        showToast.error("An error occurred while creating the schedule");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="bg-[#203a87] font-semibold text-white px-5 py-3 rounded-lg text-sm md:text-[17px]">
          Add Schedule
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[725px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50 overflow-y-auto">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Dialog.Title className="text-2xl font-bold">
                Add Conference Schedule
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </div>

            {error && (
              <Alert variant="error">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Conference</label>
                {isFetchingConferences ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
                    <span>Loading conferences...</span>
                  </div>
                ) : (
                  <select
                    value={scheduleDetails.event_id}
                    onChange={(e) => handleInputChange("event_id", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                    required
                  >
                    <option value="" disabled>Select a conference</option>
                    {conferences.map((conference) => (
                      <option key={conference.id} value={conference.id.toString()}>
                        {conference.title} - {conference.status} ({conference.date})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Day</label>
                <input
                  type="text"
                  value={scheduleDetails.day}
                  onChange={(e) => handleInputChange("day", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g., Day 1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={scheduleDetails.start}
                    onChange={(e) => handleInputChange("start", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="date"
                    value={scheduleDetails.end}
                    onChange={(e) => handleInputChange("end", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Activity</label>
                <input
                  type="text"
                  value={scheduleDetails.activity}
                  onChange={(e) => handleInputChange("activity", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter activity name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Venue</label>
                <input
                  type="text"
                  value={scheduleDetails.venue}
                  onChange={(e) => handleInputChange("venue", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter venue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Facilitator</label>
                <input
                  type="text"
                  value={scheduleDetails.facilitator}
                  onChange={(e) => handleInputChange("facilitator", e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter facilitator name"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Dialog.Close asChild>
                <button 
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                disabled={isLoading || isFetchingConferences}
                className="px-4 py-2 text-sm font-medium text-white bg-[#203a87] rounded-md hover:bg-[#152a61] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Schedule"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConferenceScheduleModal;