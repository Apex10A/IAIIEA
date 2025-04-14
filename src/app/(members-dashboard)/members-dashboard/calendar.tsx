"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Info, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSession } from "next-auth/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { Skeleton } from '@radix-ui/themes';

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

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
          className={`p-2 border border-gray-200 min-h-[100px] hover:bg-gray-50 transition-colors ${
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
            </div>
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] ">
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
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Event Calendar</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToPreviousMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </Button>
            <span className="text-md font-medium text-gray-700 min-w-[120px] text-center">
              {/* {currentMonth.title} {currentYear} */} {currentMonth.title} 
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className='w-full overflow-x-auto'>
      <Card className="mx-auto min-w-[1200px] lg:w-full">
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
          <div className="grid grid-cols-7 gap-1 sm:gap-2 auto-rows-fr">
            {renderCalendarDays()}
          </div>
        </CardContent>
      </Card>
      </div>
      
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