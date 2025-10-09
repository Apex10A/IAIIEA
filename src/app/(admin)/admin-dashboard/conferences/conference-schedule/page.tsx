"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import ConferenceScheduleModal from "./components/conferenceScheduleModal";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, MapPin, User, Trash2, Clock, Plus, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { showToast } from '@/utils/toast';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useForm } from 'react-hook-form';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';

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
  const [pendingDeleteScheduleId, setPendingDeleteScheduleId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const { register, handleSubmit, reset } = useForm<Schedule>();

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
    fetchConferences();
    // showToast.success("Schedule added successfully!");
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

  const openEditModal = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setEditModalOpen(true);
    reset(schedule);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingSchedule(null);
  };

  const handleEditSchedule = async (data: Schedule) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/edit_conference_schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: JSON.stringify({
          schedule_id: editingSchedule?.schedule_id,
          day: data.day,
          start: data.start,
          end: data.end,
          activity: data.activity,
          venue: data.venue,
          facilitator: data.facilitator,
        }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        showToast.success('Schedule updated successfully!');
        fetchConferences();
        closeEditModal();
      } else {
        throw new Error(result.message || 'Failed to update schedule');
      }
    } catch (error) {
      showToast.error(error instanceof Error ? error.message : 'An error occurred while updating the schedule');
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50   space-y-6 w-full max-w-4xl mx-auto px-2 sm:px-4 md:ml-64">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800  flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            Conference Schedules
          </h1>
          <p className="text-sm text-gray-500  mt-1">
            View schedules for upcoming and past conferences
          </p>
        </div>
        <ConferenceScheduleModal onScheduleAdded={handleScheduleAdded} />
      </div>

      {conferences.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center bg-white  shadow-lg">
          <p className="text-gray-500  mb-4">No conferences available yet.</p>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/admin/conferences/create">
              Create your first conference
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {conferences.map((conference) => (
            <Card key={conference.id} className="overflow-hidden bg-white  rounded-xl shadow-lg border border-blue-100 ">
              <button
                onClick={() => toggleConference(conference.id)}
                className="w-full text-left"
              >
                <CardHeader className="flex flex-row items-center justify-between hover:bg-blue-50  transition-colors p-4 sm:p-6">
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
                      <CardTitle className="text-lg flex items-center gap-2 text-gray-900 ">
                        {conference.title}
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          conference.status === "Incoming" 
                            ? "bg-blue-100 text-blue-800  " 
                            : "bg-gray-100 text-gray-800  "
                        }`}>
                          {conference.status}
                        </span>
                      </CardTitle>
                      <p className="text-sm text-gray-500  mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        {conference.date}
                      </p>
                    </div>
                  </div>
                  {expandedConference === conference.id ? (
                    <ChevronUp className="h-5 w-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-blue-500" />
                  )}
                </CardHeader>
              </button>
              {expandedConference === conference.id && (
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="mb-4">
                    <h3 className="font-medium text-gray-900 ">{conference.theme}</h3>
                    <p className="text-sm text-gray-500  flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {conference.venue}
                    </p>
                  </div>
                  {conference.schedule.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-6 text-center bg-blue-50 ">
                      <p className="text-gray-500  mb-4">No schedules available for this conference.</p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {conference.schedule.map((schedule) => (
                        <Card key={schedule.schedule_id} className="hover:shadow-xl transition-shadow h-full bg-gradient-to-br from-green-50 to-emerald-50   rounded-lg border border-green-200 ">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-2">
                              <CardTitle className="text-lg line-clamp-2 text-gray-900 ">
                                {schedule.activity}
                              </CardTitle>
                              <span className="inline-flex items-center rounded-md bg-green-100  px-2 py-1 text-xs font-medium text-green-700  ring-1 ring-inset ring-green-500/10">
                                {schedule.day}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5">
                                <CalendarDays className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 ">{formatDate(schedule.start)}</p>
                                {schedule.start !== schedule.end && (
                                  <p className="text-xs text-gray-500 ">
                                    to {formatDate(schedule.end)}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <p className="text-sm text-gray-900 ">
                                {formatTime(schedule.start)} - {formatTime(schedule.end)}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-blue-500" />
                              <p className="text-sm text-gray-900 ">{schedule.venue}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <User className="h-4 w-4 text-blue-500" />
                              <p className="text-sm text-gray-900 ">Facilitator: {schedule.facilitator}</p>
                            </div>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center pt-4 border-t border-green-100 ">
                            <p className="text-xs text-gray-500 ">
                              Posted: {new Date(schedule.posted).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="bg-blue-50  text-blue-700  hover:bg-blue-100 " onClick={() => openEditModal(schedule)}>
                                Edit
                              </Button>
                              <AlertDialog.Root open={pendingDeleteScheduleId === schedule.schedule_id} onOpenChange={(open) => { if (!open) setPendingDeleteScheduleId(null); }}>
                                <AlertDialog.Trigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => setPendingDeleteScheduleId(schedule.schedule_id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialog.Trigger>
                                <AlertDialog.Portal>
                                  <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
                                  <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
                                    <AlertDialog.Title className="text-lg font-semibold">
                                      Delete Schedule
                                    </AlertDialog.Title>
                                    <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
                                      Are you sure you want to delete this schedule? This action cannot be undone.
                                    </AlertDialog.Description>
                                    <div className="flex justify-end gap-4">
                                      <AlertDialog.Cancel asChild>
                                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
                                          Cancel
                                        </button>
                                      </AlertDialog.Cancel>
                                      <AlertDialog.Action asChild>
                                        <button 
                                          onClick={() => { handleDeleteSchedule(schedule.schedule_id); setPendingDeleteScheduleId(null); }}
                                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        >
                                          Delete
                                        </button>
                                      </AlertDialog.Action>
                                    </div>
                                  </AlertDialog.Content>
                                </AlertDialog.Portal>
                              </AlertDialog.Root>
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

      {/* Edit Schedule Modal - render outside the map, only if editingSchedule is not null */}
      {editingSchedule && (
        <AlertDialog.Root open={editModalOpen} onOpenChange={setEditModalOpen}>
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
            <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[95vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-lg focus:outline-none z-50 overflow-y-auto">
              <AlertDialog.Title className="text-2xl font-bold mb-4">Edit Schedule</AlertDialog.Title>
              <form onSubmit={handleSubmit(handleEditSchedule)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Day</label>
                  <input
                    type="text"
                    {...register('day', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      {...register('start', { required: true })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      {...register('end', { required: true })}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Activity</label>
                  <input
                    type="text"
                    {...register('activity', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Venue</label>
                  <input
                    type="text"
                    {...register('venue', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Facilitator</label>
                  <input
                    type="text"
                    {...register('facilitator', { required: true })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                  <AlertDialog.Cancel asChild>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={closeEditModal}
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#203a87] rounded-md hover:bg-[#152a61]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </div>
  );
};

export default ConferenceSchedule;