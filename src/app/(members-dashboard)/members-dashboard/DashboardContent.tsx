"use client"
import React, { useState, useEffect } from 'react';
import { SkeletonLoader } from './SkeletonLoader';
import { UserDataType } from '@/app/(members-dashboard)/members-dashboard/dash/types';
import { CheckCircle, AlertCircle, Loader2, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import Calendar from "./calendar";
import { useSession } from "next-auth/react";
import Link from 'next/link';

interface Event {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
  is_registered?: boolean;
  start_date?: string;
  start_time?: string;
  registered_plan?: {
    [key: string]: number;
  };
}

interface CalendarEvent {
  day: string;
  events: {
    event_id: number;
    date: string;
    time: string;
    activity: string;
    location: string;
    description: string;
    priority_level: string;
    color: string;
  }[];
}

interface DashboardContentProps {
  user: UserDataType | null;
  error?: string | null;
}

export const DashboardContent: React.FC<DashboardContentProps> = ({ user, error }) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [conferences, setConferences] = useState<Event[]>([]);
  const [seminars, setSeminars] = useState<Event[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [loadingStatus, setLoadingStatus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Get the bearer token from session
        const token = session?.user?.token;
        
        if (!token) {
          console.log('Session data:', session); // Debug log
          throw new Error("No authentication token found. Please log in again.");
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch conferences
        try {
          const confResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
            headers
          });
          
          if (!confResponse.ok) {
            throw new Error(`HTTP error! status: ${confResponse.status}`);
          }
          
          const confData = await confResponse.json();
          console.log('Initial conferences data:', confData);
          
          if (confData.status === 'success') {
            const incomingConfs = confData.data.filter((event: Event) => event.status === 'Incoming');
            console.log('Filtered incoming conferences:', incomingConfs);
            
            // First set the basic conference data
            setConferences(incomingConfs);
            
            // Then fetch detailed data for each conference
            for (const conf of incomingConfs) {
              try {
                const detailsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conf.id}`,
                  { headers }
                );
                
                if (!detailsResponse.ok) {
                  console.error(`Failed to fetch details for conference ${conf.id}:`, detailsResponse.status);
                  continue;
                }
                
                const detailsData = await detailsResponse.json();
                console.log(`Detailed data for conference ${conf.id}:`, detailsData);

                if (detailsData.status === 'success') {
                  setConferences(prev => prev.map(existingConf => 
                    existingConf.id === conf.id ? {
                      ...existingConf,
                      is_registered: detailsData.data.is_registered,
                      registered_plan: detailsData.data.registered_plan,
                      theme: detailsData.data.theme,
                      start_date: detailsData.data.start_date,
                      start_time: detailsData.data.start_time
                    } : existingConf
                  ));
                }
              } catch (error) {
                console.error(`Error fetching details for conference ${conf.id}:`, error);
              }
            }
          }
        } catch (confError) {
          console.error("Error fetching conferences:", confError);
          setLocalError(confError instanceof Error ? 
            `Failed to load conferences: ${confError.message}` : 
            "Failed to load conferences: Network error"
          );
        }

        // Fetch seminars with error handling
        try {
          const semResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`, {
            headers
          });
          
          if (!semResponse.ok) {
            throw new Error(`HTTP error! status: ${semResponse.status}`);
          }
          
          const semData = await semResponse.json();
          if (semData.status === 'success') {
            const incomingSems = semData.data.filter((event: Event) => event.status === 'Incoming');
            setSeminars(incomingSems);
            
            // Fetch details for each seminar
            for (const sem of incomingSems) {
              try {
                const detailsResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${sem.id}`,
                  { headers }
                );
                
                if (!detailsResponse.ok) {
                  console.error(`Failed to fetch details for seminar ${sem.id}:`, detailsResponse.status);
                  continue;
                }
                
                const detailsData = await detailsResponse.json();
                if (detailsData.status === 'success') {
                  setSeminars(prev => prev.map(existingSem => 
                    existingSem.id === sem.id ? {
                      ...existingSem,
                      is_registered: detailsData.data.is_registered,
                      registered_plan: detailsData.data.registered_plan
                    } : existingSem
                  ));
                }
              } catch (error) {
                console.error(`Error fetching details for seminar ${sem.id}:`, error);
              }
            }
          }
        } catch (semError) {
          console.error("Error fetching seminars:", semError);
        }

        // Fetch calendar events with error handling
        try {
          const year = new Date().getFullYear();
          const calResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/anual_calendar/${year}`, {
            headers
          });
          
          if (!calResponse.ok) {
            throw new Error(`HTTP error! status: ${calResponse.status}`);
          }
          
          const calData = await calResponse.json();
          if (calData.status === 'success') {
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const monthData = calData.data.find((month: any) => month.title.includes(currentMonth));
            if (monthData) {
              setCalendarEvents(monthData.days);
            }
          }
        } catch (calError) {
          console.error("Error fetching calendar events:", calError);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Main error in fetchData:", err);
        setLocalError(err instanceof Error ? err.message : "Failed to load dashboard data");
        setIsLoading(false);
      }
    };

    const checkRegistrationStatus = async (events: Event[], type: 'conference' | 'seminar') => {
      for (const event of events) {
        try {
          setLoadingStatus(prev => ({ ...prev, [event.id]: true }));
          const endpoint = type === 'conference' 
            ? `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${event.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/landing/seminar_details/${event.id}`;
          
          // Add cache-busting query parameter
          const cacheBuster = new Date().getTime();
          const response = await fetch(`${endpoint}?_=${cacheBuster}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          const data = await response.json();
          console.log(`Registration status for ${type} ${event.id}:`, data);
          
          if (data.status === 'success') {
            if (type === 'conference') {
              setConferences(prev => {
                const updated = prev.map(conf => 
                  conf.id === event.id ? { 
                    ...conf, 
                    is_registered: data.data.is_registered,
                    registered_plan: data.data.registered_plan
                  } : conf
                );
                console.log('Updated conferences:', updated);
                return updated;
              });
            } else {
              setSeminars(prev => {
                const updated = prev.map(sem => 
                  sem.id === event.id ? { 
                    ...sem, 
                    is_registered: data.data.is_registered,
                    registered_plan: data.data.registered_plan
                  } : sem
                );
                console.log('Updated seminars:', updated);
                return updated;
              });
            }
          }
        } catch (err) {
          console.error(`Error checking registration for ${type} ${event.id}:`, err);
        } finally {
          setLoadingStatus(prev => ({ ...prev, [event.id]: false }));
        }
      }
    };

    fetchData();
  }, [session]);

  const getStatusIcon = (status: string) => {
    return status.toLowerCase() === 'complete' ? (
      <CheckCircle className="w-4 h-4 text-green-500 inline ml-1" />
    ) : (
      <Loader2 className="w-4 h-4 text-yellow-500 inline ml-1 animate-spin" />
    );
  };

  const formatDateRange = (dateString: string) => {
    return dateString.replace('To', '-');
  };

  const formatEventDate = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    };
    let formatted = date.toLocaleDateString('en-US', options);
    
    if (timeStr) {
      const time = new Date(`2000-01-01T${timeStr}`);
      formatted += ` • ${time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return formatted;
  };

  if (error || localError) {
    return (
      <div className="p-6 bg-[#F9FAFF] min-h-[300px] flex flex-col items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4">{error || localError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-[#F9FAFF] space-y-6">
        <div className="bg-gray-100 rounded-lg px-5 py-4">
          <SkeletonLoader className="h-6 w-32 md:h-7 md:w-48" />
        </div>
        
        <div className="space-y-4">
          <SkeletonLoader className="h-9 w-48 md:h-10 md:w-64" />
          <div className="space-y-3">
            <SkeletonLoader className="h-4 w-full md:w-3/4" />
            <SkeletonLoader className="h-4 w-full md:w-2/3" />
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <SkeletonLoader className="h-5 w-36" />
          <SkeletonLoader className="h-5 w-40" />
          <SkeletonLoader className="h-5 w-36" />
        </div>
      </div>
    );
  }

  return (
    <div className="md:p-6 bg-[#F9FAFF]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#203a87] to-indigo-700 text-white rounded-lg px-5 py-4 mb-6 shadow-sm">
        <h1 className="text-lg md:text-xl font-medium">Dashboard Overview</h1>
      </div>
      
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'User'} 👋
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Here's what's happening with your events and activities
        </p>
      </div>
      
      {/* Status Section */}
      {user?.registration && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Membership Status</h2>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-800">Current Membership</p>
              <p className="text-sm text-blue-600">{user.registration}</p>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm font-medium">
              Active
            </div>
          </div>
        </div>
      )}
      
      {/* Upcoming Events Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Your Upcoming Events
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conferences */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Conferences</h3>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {conferences.length} upcoming
              </span>
            </div>
            
            {conferences.length > 0 ? (
              <div className="space-y-4">
                {conferences.map((conf) => (
                  <div key={conf.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{conf.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatEventDate(conf.start_date, conf.start_time)}
                        </p>
                      </div>
                      {loadingStatus[conf.id] ? (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${conf.is_registered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {conf.is_registered ? 'Registered' : 'Not Registered'}
                          </span>
                          {conf.is_registered && conf.registered_plan && (
                            <span className="text-xs text-gray-600">
                              {Object.keys(conf.registered_plan)[0]}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{conf.theme}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{conf.venue}</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        View details <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">No upcoming conferences</p>
              </div>
            )}
          </div>

          {/* Seminars */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Seminars</h3>
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {seminars.length} upcoming
              </span>
            </div>
            
            {seminars.length > 0 ? (
              <div className="space-y-4">
                {seminars.map((seminar) => (
                  <div key={seminar.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{seminar.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatEventDate(seminar.start_date, seminar.start_time)}
                        </p>
                      </div>
                      {loadingStatus[seminar.id] ? (
                        <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded-full ${seminar.is_registered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {seminar.is_registered ? 'Registered' : 'Not Registered'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{seminar.theme}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{seminar.venue}</span>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center">
                        View details <ChevronRight className="w-3 h-3 ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-gray-500">No upcoming seminars</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-800 font-medium">Total Events</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">
                {conferences.length + seminars.length}
              </p>
            </div>
            <div className="bg-blue-200 p-2 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-800 font-medium">Registered Events</p>
              <p className="text-2xl font-bold text-green-900 mt-1">
                {[...conferences, ...seminars].filter(e => e.is_registered).length}
              </p>
            </div>
            <div className="bg-green-200 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-700" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-800 font-medium">Upcoming Activities</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">
                {calendarEvents.filter(day => day.events.length > 0).length}
              </p>
            </div>
            <div className="bg-purple-200 p-2 rounded-lg">
              <Loader2 className="w-5 h-5 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Schedule</h2>
          <button className="text-sm text-indigo-600 hover:text-indigo-800">
            View Full Calendar
          </button>
        </div>
        <Calendar events={calendarEvents} />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/events" className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">Register for Events</h3>
            <p className="text-sm text-gray-600">Browse and register for upcoming conferences and seminars</p>
          </Link>
          <button className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">View Resources</h3>
            <p className="text-sm text-gray-600">Access materials from past events</p>
          </button>
          <button className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow text-left">
            <h3 className="font-medium text-gray-800 mb-2">Update Profile</h3>
            <p className="text-sm text-gray-600">Manage your account information</p>
          </button>
        </div>
      </div>
    </div>
  );
};