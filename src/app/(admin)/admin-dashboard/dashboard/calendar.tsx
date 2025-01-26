import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showToast } from '@/utils/toast';

// Define types
interface EventDetails {
  activity: string;
  date: string;
  time: string;
  location: string;
  description: string;
  priority_level: 'important' | 'normal';
  color: 'red' | 'blue' | 'green';
}

interface CalendarData {
  data: {
    title: string;
    days: Array<{
      day: string;
      events: any[];
    }>;
  }[];
}

interface CalendarDay {
  day: string;
  events?: Array<{
    activity: string;
    location: string;
    description: string;
    time: string;
    color: 'red' | 'blue' | 'green';
  }> | {
    activity: string;
    location: string;
    description: string;
    time: string;
    color: 'red' | 'blue' | 'green';
  };
}

const Calendar = () => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalendarData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
const [eventDetails, setEventDetails] = useState({
  activity: '',
  date: '',
  time: '',
  location: '',
  description: '',
  priority_level: 'important',
  color: 'red',
});


  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!bearerToken) {
        setError("No authorization token available");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://iaiiea.org/api/sandbox/admin/anual_calendar/2025', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch calendar data: ${response.status}`);
        }

        const calendarData = await response.json();
        setData(calendarData);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendar data:', err);
        setError('Failed to load calendar data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, [bearerToken]);

  const months = data?.data || [];
  const currentMonth = months[currentMonthIndex] || { days: [] };

  const goToPreviousMonth = () => {
    setCurrentMonthIndex(prev => prev > 0 ? prev - 1 : 11);
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex(prev => prev < 11 ? prev - 1 : 0);
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handleAddEvent = async () => {
    if (!bearerToken) {
      showToast.error("Authorization failed. Please log in again.");
      return;
    }
  
    try {
      const response = await fetch('https://iaiiea.org/api/sandbox/admin/create_calendar_activity', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
  
      const result = await response.json();
  
      // Check the actual response status from the API, not just HTTP status
      if (result.status !== 'success') {
        throw new Error(result.message || 'Event creation failed');
      }
  
      showToast.success('Event created successfully');
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      showToast.error(errorMessage);
      console.error('Event creation error:', err);
    }
  };

  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentMonthIndex, 2025);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="p-2 border border-gray-200"
        />
      );
    }

    // Actual days from API data
    // Actual days from API data
    currentMonth.days?.forEach((dayData: { day: React.Key | null | undefined; events: any; }) => {
      const dayNumber = parseInt(dayData.day as string);
      const events = [];
      
      // Handle both single event object and array of events
      if (dayData.events && typeof dayData.events === 'object') {
        if (Array.isArray(dayData.events)) {
          // Handle array of events
          events.push(...dayData.events);
        } else {
          // Handle single event object
          events.push(dayData.events);
        }
      }

      days.push(
        <div
          key={dayData.day}
          className="p-2 border border-gray-200 min-h-16 hover:bg-gray-50 cursor-pointer group"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span className="text-sm font-medium text-gray-600">{dayNumber}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-gray-600"
                onClick={() => {
                  const dateStr = `2025-${(currentMonthIndex + 1).toString().padStart(2, '0')}-${dayData.day}`;
                  setEventDetails(prev => ({ ...prev, date: dateStr }));
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <div className="mt-1 space-y-1">
              {events.map((event, idx) => (
                <div 
                  key={idx}
                  className={`text-xs p-1 rounded truncate ${
                    event.color === 'blue' ? 'bg-blue-100' :
                    event.color === 'red' ? 'bg-red-100' :
                    event.color === 'green' ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                  title={`${event.activity} - ${event.location}\n${event.description}`}
                >
                  <div className="font-medium">{event.activity}</div>
                  <div className="text-xs opacity-75">{event.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    });

    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mb-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="text-xl font-semibold text-gray-600">
            {currentMonth.title}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isModalOpen && (
  <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-600">Add Calendar Activity</h3>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Activity"
          value={eventDetails.activity}
          onChange={(e) => setEventDetails({ ...eventDetails, activity: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={eventDetails.date}
          onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
          className="w-full p-2 border rounded bg-transparent"
        />
        <input
          type="time"
          value={eventDetails.time}
          onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
          className="w-full p-2 border rounded bg-transparent"
        />
        <input
          type="text"
          placeholder="Location"
          value={eventDetails.location}
          onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
          className="w-full p-2 border rounded"
        ></textarea>
        <select
          value={eventDetails.priority_level}
          onChange={(e) => setEventDetails({ ...eventDetails, priority_level: e.target.value })}
          className="w-full p-2 border rounded bg-transparent"
        >
          <option value="important">Important</option>
          <option value="normal">Normal</option>
        </select>
        <select
          value={eventDetails.color}
          onChange={(e) => setEventDetails({ ...eventDetails, color: e.target.value })}
          className="w-full p-2 border rounded bg-transparent"
        >
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="green">Green</option>
        </select>
      </form>
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsModalOpen(false)}>
          Cancel
        </Button>
        <Button onClick={handleAddEvent} className='text-gray-600 border' variant='outline'>Save</Button>
      </div>
    </div>
  </div>
)}

<Button onClick={() => setIsModalOpen(true)}>
  <Plus className="h-4 w-4 mr-2 text-gray-600" />
 <span className='text-gray-600'>Add Event</span>
</Button>
      </div>

      <Card className="w-full  mx-auto">
  <CardContent className="p-4">
    {/* Calendar header */}
    <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div
          key={day}
          className="text-center font-semibold text-gray-600 text-xs sm:text-sm md:text-base border border-gray-200 p-1 sm:p-2"
        >
          {day}
        </div>
      ))}
    </div>
    
    {/* Calendar grid */}
    <div className="grid grid-cols-7 gap-1 sm:gap-2">
      {renderCalendarDays()}
    </div>
  </CardContent>
</Card>
    </div>
  );
};

export default Calendar;