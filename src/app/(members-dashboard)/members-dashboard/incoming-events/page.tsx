'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { FaCalendar, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
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
  type?: 'conference' | 'seminar';
  registered_plan?: {
    [key: string]: number;
  };
}

export default function IncomingEvents() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const token = session?.user?.token;
        
        if (!token) {
          throw new Error("No authentication token found. Please log in again.");
        }

        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // Fetch conferences
        const confResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`, {
          headers
        });
        const confData = await confResponse.json();
        
        // Fetch seminars
        const semResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/seminars`, {
          headers
        });
        const semData = await semResponse.json();

        let incomingEvents: Event[] = [];

        if (confData.status === "success") {
          const conferences = confData.data
            .filter((conf: Event) => conf.status === "Incoming")
            .map((conf: Event) => ({ ...conf, type: 'conference' }));
          incomingEvents = [...incomingEvents, ...conferences];
        }

        if (semData.status === "success") {
          const seminars = semData.data
            .filter((sem: Event) => sem.status === "Incoming")
            .map((sem: Event) => ({ ...sem, type: 'seminar' }));
          incomingEvents = [...incomingEvents, ...seminars];
        }

        setEvents(incomingEvents);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session]);

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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Events</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Incoming Events</h1>
        <p className="text-gray-600">Browse and register for upcoming conferences and seminars</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    event.type === 'conference' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {event.type === 'conference' ? 'Conference' : 'Seminar'}
                  </span>
                  <h3 className="text-xl font-semibold text-gray-900 mt-2">{event.title}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  event.is_registered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {event.is_registered ? 'Registered' : 'Not Registered'}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{event.theme}</p>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="w-4 h-4 mr-2" />
                  <span>{formatEventDate(event.start_date, event.start_time)}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                  <span>{event.venue}</span>
                </div>
              </div>

              <Link
                href={`/${event.type}/${event.id}`}
                className="inline-flex items-center px-4 py-2 bg-[#D5B93C] text-white rounded-lg hover:bg-[#C4A93C] transition-colors"
              >
                View Details <FaArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No incoming events at the moment.</p>
        </div>
      )}
    </div>
  );
} 