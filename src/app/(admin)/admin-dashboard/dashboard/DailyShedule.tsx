import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, MapPin, User, Trash2, Clock, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { showToast } from '@/utils/toast';
import ConferenceScheduleModal from './ConferenceScheduleModal';

interface Schedule {
  schedule_id: string;
  day: string;
  posted: string;
  activity: string;
  start: string;
  end: string;
  venue: string;
  facilitator: string;
}

const ConferenceSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    fetchSchedules();
  }, [bearerToken]);

  const fetchSchedules = async () => {
    if (!bearerToken) {
      showToast.error("Please login again");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/14`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch schedules: ${response.status}`);
      }
      
      const data = await response.json();
      setSchedules(data.data.schedule || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching schedules:', err);
      setError('Failed to load schedules. Please try again later.');
      showToast.error('Failed to load schedules. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (!bearerToken) {
      showToast.error("Please login again to perform this action");
      return;
    }

    setIsDeleting(scheduleId);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_schedule`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ schedule_id: scheduleId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete schedule: ${response.status}`);
      }

      setSchedules(schedules.filter(schedule => schedule.schedule_id !== scheduleId));
      showToast.success("Schedule deleted successfully");
    } catch (err) {
      console.error('Error deleting schedule:', err);
      showToast.error('Failed to delete schedule. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleScheduleAdded = () => {
    fetchSchedules();
    showToast.success("Schedule added successfully!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-5 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </CardContent>
              <CardFooter className="flex justify-end">
                <div className="h-9 w-20 bg-gray-200 rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={fetchSchedules}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Conference Schedule</h2>
          <p className="text-sm text-gray-500 mt-1">
            {schedules.length} {schedules.length === 1 ? 'event' : 'events'} scheduled
          </p>
        </div>
        {/* <ConferenceScheduleModal onScheduleAdded={handleScheduleAdded}>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </ConferenceScheduleModal> */}
      </div>

      {schedules.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500 mb-4">No schedules available yet.</p>
          <ConferenceScheduleModal onScheduleAdded={handleScheduleAdded}>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create your first schedule
            </Button>
          </ConferenceScheduleModal>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <Card key={schedule.schedule_id} className="hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg line-clamp-2">
                    {schedule.activity}
                  </CardTitle>
                  <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    {schedule.day}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{formatDate(schedule.start)}</p>
                    {schedule.start !== schedule.end && (
                      <p className="text-xs text-muted-foreground">
                        to {formatDate(schedule.end)}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">
                    {formatTime(schedule.start)} - {formatTime(schedule.end)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{schedule.venue}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Facilitator: {schedule.facilitator}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Posted: {new Date(schedule.posted).toLocaleDateString()}
                </p>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                  disabled={isDeleting === schedule.schedule_id}
                >
                  {isDeleting === schedule.schedule_id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceSchedule;