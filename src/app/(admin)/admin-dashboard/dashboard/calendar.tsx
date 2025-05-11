import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { showToast } from '@/utils/toast';
import { motion } from 'framer-motion';
import { Skeleton } from '@radix-ui/themes';

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
      events?: any[] | any;
    }>;
  }[];
}

const Calendar = () => {
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalendarData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<EventDetails>({
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
        const currentYear = new Date().getFullYear();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/anual_calendar/${currentYear}`, {
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
  const currentYear = new Date().getFullYear();

  const goToPreviousMonth = () => {
    setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11));
  };

  const goToNextMonth = () => {
    setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0));
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/create_calendar_activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });
  
      const result = await response.json();
  
      if (result.status !== 'success') {
        throw new Error(result.message || 'Event creation failed');
      }
  
      showToast.success('Event created successfully');
      setIsModalOpen(false);
      
      // Refresh calendar data
      setIsLoading(true);
      const fetchResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/anual_calendar/${currentYear}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (fetchResponse.ok) {
        const refreshedData = await fetchResponse.json();
        setData(refreshedData);
      }
      setIsLoading(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      showToast.error(errorMessage);
      console.error('Event creation error:', err);
    }
  };

  const openViewModal = (event: any) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentMonthIndex, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="p-2 border border-gray-200 bg-gray-50 min-h-[100px]"
        />
      );
    }

    // Actual days from API data
    currentMonth.days?.forEach((dayData) => {
      const dayNumber = parseInt(dayData.day as string);
      const events = [];
      
      if (dayData.events && typeof dayData.events === 'object') {
        if (Array.isArray(dayData.events)) {
          events.push(...dayData.events);
        } else {
          events.push(dayData.events);
        }
      }

      const currentDate = new Date();
      const isCurrentDay = 
        currentDate.getDate() === dayNumber && 
        currentDate.getMonth() === currentMonthIndex &&
        currentDate.getFullYear() === currentYear;

      days.push(
        <motion.div
          key={dayData.day}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-2 border border-gray-200 min-h-[100px] hover:bg-gray-50 cursor-pointer transition-colors ${
            isCurrentDay ? 'bg-blue-50 border-blue-200' : ''
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-medium ${
                isCurrentDay ? 'text-blue-600 font-bold' : 'text-gray-600'
              }`}>
                {dayNumber}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="opacity-0 group-hover:opacity-100 p-1 h-6 w-6 text-gray-600 hover:text-gray-900"
                onClick={() => {
                  const dateStr = `${currentYear}-${(currentMonthIndex + 1).toString().padStart(2, '0')}-${dayNumber.toString().padStart(2, '0')}`;
                  setEventDetails(prev => ({ ...prev, date: dateStr }));
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
              {events.map((event, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={`text-xs p-1 rounded truncate ${
                    event.color === 'blue' ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' :
                    event.color === 'red' ? 'bg-red-100 hover:bg-red-200 text-red-800' :
                    event.color === 'green' ? 'bg-green-100 hover:bg-green-200 text-green-800' : 
                    'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  } cursor-pointer transition-colors`}
                  title={`${event.activity} - ${event.location}`}
                  onClick={() => openViewModal(event)}
                >
                  <div className="font-medium truncate">{event.activity}</div>
                  <div className="text-xs opacity-75 truncate">{event.time}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      );
    });

    return days;
  };

  if (isLoading) {
    return (
      <div className="space-y-4 px-3 py-3 rounded-lg">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-32" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
          <Skeleton className="h-8 w-24" />
        </div>
        
        <Card className="w-full mx-auto">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {[...Array(42)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" className="mb-4">
        <AlertDescription>
          <div className="flex items-center gap-2">
            <span>{error}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="text-sm"
            >
              Retry
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 px-3 py-3 rounded-lg">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <div className="sm:flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Event Calendar</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-md font-medium text-gray-700 min-w-[120px] text-center">
              {currentMonth.title} 
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#0E1A3D] hover:bg-[#152a61] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card className="w-full mx-auto">
        <CardContent className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div
                key={day}
                className="text-center font-semibold text-gray-600 text-xs sm:text-sm border border-gray-200 p-2 bg-gray-50 rounded"
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr min-w-[1200px]">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>
      
      {/* Add Event Modal */}
      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Add New Event</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                  <input
                    type="text"
                    placeholder="Event name"
                    value={eventDetails.activity}
                    onChange={(e) => setEventDetails({ ...eventDetails, activity: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={eventDetails.date}
                      onChange={(e) => setEventDetails({ ...eventDetails, date: e.target.value })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="time"
                      value={eventDetails.time}
                      onChange={(e) => setEventDetails({ ...eventDetails, time: e.target.value })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Where is the event?"
                    value={eventDetails.location}
                    onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    placeholder="Event details"
                    value={eventDetails.description}
                    onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
                    rows={3}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={eventDetails.priority_level}
                      onChange={(e) => setEventDetails({ ...eventDetails, priority_level: e.target.value as 'important' | 'normal' })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                    >
                      <option value="important">Important</option>
                      <option value="normal">Normal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <select
                      value={eventDetails.color}
                      onChange={(e) => setEventDetails({ ...eventDetails, color: e.target.value as 'red' | 'blue' | 'green' })}
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#0E1A3D] focus:border-[#0E1A3D] outline-none"
                    >
                      <option value="red">Red</option>
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                    </select>
                  </div>
                </div>
              </form>
              
              <div className="mt-6 flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddEvent}
                  className="bg-[#0E1A3D] hover:bg-[#152a61] text-white"
                >
                  Save Event
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* View Event Modal */}
      {isViewModalOpen && selectedEvent && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Event Details</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className={`p-4 rounded-lg mb-4 ${
                selectedEvent.color === 'blue' ? 'bg-blue-50 border border-blue-100' :
                selectedEvent.color === 'red' ? 'bg-red-50 border border-red-100' :
                selectedEvent.color === 'green' ? 'bg-green-50 border border-green-100' : 
                'bg-gray-50 border border-gray-100'
              }`}>
                <h4 className="text-lg font-bold mb-2">{selectedEvent.activity}</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Time</p>
                      <p className="text-gray-800">{selectedEvent.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Location</p>
                      <p className="text-gray-800">{selectedEvent.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Info className="h-5 w-5 mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Description</p>
                      <p className="text-gray-800 whitespace-pre-line">{selectedEvent.description || 'No description provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setIsViewModalOpen(false)}
                  className="bg-[#0E1A3D] hover:bg-[#152a61] text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Calendar;