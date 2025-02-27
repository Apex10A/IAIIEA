import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, MapPin, User, Trash2 } from 'lucide-react';
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

interface ConferenceScheduleModalProps {
  onScheduleAdded: () => void;
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

      // Remove the deleted schedule from the state
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
    showToast.success("Schedule added!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-600">Conference Schedule</h2>
        <ConferenceScheduleModal onScheduleAdded={handleScheduleAdded}/>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">No schedules available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {schedules.map((schedule) => (
            <Card key={schedule.schedule_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{schedule.day}</span>
                  <span className="text-sm text-gray-500">{schedule.posted}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{schedule.activity}</h3>
                  
                  <div className="flex items-center text-gray-600 gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span className='text-sm md:text-md'>{new Date(schedule.start).toLocaleDateString()} - {new Date(schedule.end).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className='text-sm md:text-md'>{schedule.venue}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 gap-2">
                    <User className="h-4 w-4" />
                    <span className='text-sm md:text-md'>{schedule.facilitator}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
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