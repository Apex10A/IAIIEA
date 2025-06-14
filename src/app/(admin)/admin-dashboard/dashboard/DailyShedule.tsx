"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import ConferenceScheduleModal from "./ConferenceScheduleModal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, MapPin, User, Trash2, Clock, Plus, Calendar, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { showToast } from '@/utils/toast';
import { motion } from 'framer-motion';

import Image from "next/image";
import Link from "next/link";

interface Schedule {
  schedule_id: number;
  day: string;
  posted: string;
  activity: string;
  start: string;
  end: string;
  venue: string;
  facilitator: string;
}

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: "Completed" | "Incoming";
  schedule: Schedule[];
  flyer?: string;
}

const ConferenceSchedule = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedConference, setExpandedConference] = useState<number | null>(null);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  useEffect(() => {
    fetchConferences();
  }, [bearerToken]);

  const fetchConferences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // First fetch the list of all conferences
      const listResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/landing/events`);
      
      if (!listResponse.ok) {
        throw new Error(`Failed to fetch conferences: ${listResponse.status}`);
      }
      
      const listData = await listResponse.json();
      const conferencesList = listData.data || [];

      // Then fetch details for each conference to get their schedules
      const conferencesWithDetails = await Promise.all(
        conferencesList.map(async (conf: any) => {
          try {
            const detailsResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${conf.id}`,
              {
                headers: {
                  'Authorization': `Bearer ${bearerToken}`,
                  'Content-Type': 'application/json',
                },
              }
            );

            if (!detailsResponse.ok) {
              console.error(`Failed to fetch details for conference ${conf.id}`);
              return {
                ...conf,
                schedule: []
              };
            }

            const detailsData = await detailsResponse.json();
            return {
              ...conf,
              schedule: detailsData.data?.schedule || []
            };
          } catch (error) {
            console.error(`Error fetching details for conference ${conf.id}:`, error);
            return {
              ...conf,
              schedule: []
            };
          }
        })
      );

      // Sort conferences with incoming first, then by date (newest to oldest)
      const sortedConferences = conferencesWithDetails.sort((a, b) => {
        if (a.status === "Incoming" && b.status !== "Incoming") return -1;
        if (a.status !== "Incoming" && b.status === "Incoming") return 1;
        
        // Extract years from dates for comparison
        const yearA = parseInt(a.date.match(/\d{4}/)?.[0] || 0);
        const yearB = parseInt(b.date.match(/\d{4}/)?.[0] || 0);
        
        return yearB - yearA;
      });

      setConferences(sortedConferences);
      
      // Expand the first conference (likely the incoming one) by default
      if (sortedConferences.length > 0) {
        setExpandedConference(sortedConferences[0].id);
      }
    } catch (err) {
      console.error('Error fetching conferences:', err);
      setError('Failed to load conferences. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleConference = (id: number) => {
    setExpandedConference(expandedConference === id ? null : id);
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

   // Render loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6 w-full">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-12 w-full bg-gray-200 animate-pulse rounded"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader>
                <div className="h-6 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-4 w-full bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              </CardContent>
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
          onClick={fetchConferences}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-200 p-4 rounded-lg">
          <p className="font-medium">Error loading schedule</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
          >
            Try Again
          </button>
        </div>
      ) : conferences.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No conferences available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {conferences.map((conference) => (
            <motion.div
              key={conference.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden"
            >
              <div 
                className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleConference(conference.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white truncate">
                      {conference.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                      {conference.theme}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                        {formatDate(conference.date)}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-1.5" />
                        {conference.venue}
                      </span>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`h-5 w-5 md:h-6 md:w-6 text-gray-400 transition-transform ${
                      expandedConference === conference.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {expandedConference === conference.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t dark:border-gray-700"
                >
                  <div className="p-4 md:p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="border-b dark:border-gray-700">
                            <th className="text-left py-3 px-4 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Time</th>
                            <th className="text-left py-3 px-4 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Activity</th>
                            <th className="text-left py-3 px-4 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Venue</th>
                            <th className="text-left py-3 px-4 text-sm md:text-base font-medium text-gray-500 dark:text-gray-400">Facilitator</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conference.schedule.map((item, index) => (
                            <tr 
                              key={index}
                              className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                            >
                              <td className="py-3 px-4 text-sm md:text-base text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                {formatTime(item.start)} - {formatTime(item.end)}
                              </td>
                              <td className="py-3 px-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                                {item.activity}
                              </td>
                              <td className="py-3 px-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                                {item.venue}
                              </td>
                              <td className="py-3 px-4 text-sm md:text-base text-gray-600 dark:text-gray-300">
                                {item.facilitator}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceSchedule;