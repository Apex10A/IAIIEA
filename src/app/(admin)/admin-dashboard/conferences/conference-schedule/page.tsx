"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import ConferenceScheduleModal from "./components/conferenceScheduleModal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, MapPin, User, Trash2, Clock, Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { showToast } from '@/utils/toast';

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

  const handleDeleteSchedule = async (schedule_id: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_schedule`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({ schedule_id }),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete schedule: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.status === "success") {
        showToast.success("Schedule deleted successfully!");
        // Optionally refresh the list of schedules here
        if (handleScheduleAdded) handleScheduleAdded(); // or a dedicated refresh function
      } else {
        throw new Error(result.message || "Failed to delete schedule");
      }
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : "An error occurred while deleting the schedule");
    }
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
    <div className="space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Conference Schedules</h1>
          <p className="text-sm text-gray-500 mt-1">
            View schedules for upcoming and past conferences
          </p>
        </div>
    <ConferenceScheduleModal onScheduleAdded={handleScheduleAdded}>
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add Schedule
          </Button>
        </ConferenceScheduleModal>
      </div>

      {conferences.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500 mb-4">No conferences available yet.</p>
          <Button asChild>
            <Link href="/admin/conferences/create">
              Create your first conference
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {conferences.map((conference) => (
            <Card key={conference.id} className="overflow-hidden">
              <button
                onClick={() => toggleConference(conference.id)}
                className="w-full text-left"
              >
                <CardHeader className="flex flex-row items-center justify-between hover:bg-gray-50 transition-colors p-4 sm:p-6">
                  <div className="flex items-center gap-4">
                    {conference.flyer && (
                      <div className="relative h-16 w-16 rounded-md overflow-hidden">
                        <Image
                          src={conference.flyer}
                          alt={conference.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {conference.title}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          conference.status === "Incoming" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {conference.status}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {conference.date}
                      </p>
                    </div>
                  </div>
                  {expandedConference === conference.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </CardHeader>
              </button>
              
              {expandedConference === conference.id && (
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900">{conference.theme}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4" />
                      {conference.venue}
                    </p>
                  </div>
                  
                  {conference.schedule.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center">
                      <p className="text-gray-500 mb-4">No schedules available for this conference.</p>
                      {/* <Button asChild>
                        <Link href={`/admin/conferences/${conference.id}/create-schedule`}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Schedule
                        </Link>
                      </Button> */}
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {conference.schedule.map((schedule) => (
                        <Card key={schedule.schedule_id} className="hover:shadow-md transition-shadow h-full">
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
                          <CardContent className="space-y-3">
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
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/conferences/${conference.id}/schedule/${schedule.schedule_id}/edit`}>
                                  Edit
                                </Link>
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteSchedule(schedule.schedule_id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConferenceSchedule;