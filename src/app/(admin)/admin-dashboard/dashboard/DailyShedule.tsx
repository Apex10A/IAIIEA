import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, MapPin, User } from 'lucide-react';
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
  onScheduleAdded: () => void; // Adjust the type based on your requirements
}

const ConferenceSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!bearerToken) {
        showToast.error("Pls login again");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://iaiiea.org/api/sandbox/landing/event_details/1', {
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

    fetchSchedules();
  }, [bearerToken]);

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
  const handleScheduleAdded = () => {
    // Logic to handle when a schedule is added
    showToast.success("Schedule added!");
  };
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
        <div className="grid gap-4 md:grid-cols-2 ">
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
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceSchedule;