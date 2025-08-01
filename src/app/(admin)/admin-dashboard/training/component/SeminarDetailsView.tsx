"use client";

import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Seminar, SeminarDetails, SeminarDetailsProps } from './types';
import EditSeminarModal from './EditSeminars';
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import {
  Trash2,
  Calendar,
  MapPin,
  ArrowLeft,
  Loader2,
  Pencil,
  FileText
} from "lucide-react";
import { showToast } from "@/utils/toast";
import Image from "next/image";
import { AddResourceModal } from './components';

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

const SeminarDetailsView: React.FC<SeminarDetailsProps> = ({
  seminar,
  seminarDetails,
  loading,
  onBack,
  onEdit,
  onDelete,
  handleDeleteSeminar,
  onViewResources,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const refreshResources = async () => {
    await onEdit();
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!bearerToken) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/delete_seminar_resource/${resourceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      showToast.success('Resource deleted');
      await refreshResources();
    } catch (error) {
      showToast.error('Failed to delete resource');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!seminarDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-900 dark:text-white">Failed to load seminar details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 bg-white hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to seminars
        </Button>
      </div>
     
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {seminar.title}
            </h1>
          </div>
          
          <div className="mb-4">
            <p className="text-lg sm:text-xl text-blue-700 dark:text-blue-300 uppercase font-bold">
              {seminar.theme}
            </p>
          </div>
      
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">
                  {formatEventDate(seminarDetails.start_date, seminarDetails.start_time)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-gray-700 dark:text-gray-300 text-sm">{seminar.venue}</p>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <EditSeminarModal 
              seminar={{
                id: seminar.id,
                title: seminar.title,
                theme: seminar.theme,
                venue: seminar.venue,
                start_date: seminarDetails.start_date,
                start_time: seminarDetails.start_time,
                status: seminar.status,
                speakers: seminarDetails.speakers || [],
                payments: seminarDetails.payments
              }}
              onSuccess={onEdit}
              trigger={
                <Button variant="outline" className="w-full sm:w-auto text-sm text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 bg-white hover:bg-gray-50">
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit Seminar
                </Button>
              }
            />
            
            <AlertDialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialog.Trigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto text-sm text-red-600 dark:text-red-400 border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Seminar
                </Button>
              </AlertDialog.Trigger>
              <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <AlertDialog.Content className="fixed top-[50%] left-[50%] max-w-[500px] w-[90vw] translate-x-[-50%] translate-y-[-50%] bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <AlertDialog.Title className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Delete Seminar
                  </AlertDialog.Title>
                  <AlertDialog.Description className="mt-4 mb-6 text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this seminar? This action cannot be undone.
                  </AlertDialog.Description>
                  <div className="flex justify-end gap-4">
                    <AlertDialog.Cancel asChild>
                      <Button variant="outline" className="text-gray-900 border-gray-200 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800">
                        Cancel
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <Button 
                        variant="destructive"
                        onClick={async () => {
                          console.log("Deleting seminar with ID:", seminar.id);
                          await handleDeleteSeminar(seminar.id);
                          setShowDeleteDialog(false);
                        }}
                      >
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </div>
        </div>

        <div className="p-6">
          {/* Speakers Section */}
          {seminarDetails.speakers && seminarDetails.speakers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Speakers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.speakers.map((speaker, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-blue-100 dark:bg-gray-600 ring-2 ring-blue-200 dark:ring-gray-600">
                        <Image
                          src={speaker.picture || '/speakers/speaker_avatar.png'}
                          alt={speaker.name || ''}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{speaker.name}</h3>
                        {speaker.portfolio && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{speaker.portfolio}</p>
                        )}
                        {speaker.title && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">{speaker.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Resources
              </h2>
              <AddResourceModal seminarId={seminar.id} onSuccess={refreshResources} />
            </div>
            {seminarDetails.resources?.length === 0 ? (
              <p className="text-gray-500">No resources yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {seminarDetails.resources.map((resource) => (
                  <div key={resource.resource_id} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg border border-green-200 dark:border-gray-600 flex flex-col gap-2">
                    <div className="flex flex-col gap-4">
                      {resource.resource_type?.toLowerCase().includes('video') ? (
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <video
                            src={resource.file}
                            controls
                            className="w-full h-full object-cover"
                            poster="/video-thumbnail.png"
                            preload="metadata"
                          >
                            <source src={resource.file} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center aspect-video rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 dark:from-gray-800 dark:to-gray-700">
                          <FileText className="w-12 h-12 text-green-500 dark:text-green-400" />
                        </div>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 dark:text-white">{resource.caption}</h3>
                          <p className="text-sm text-green-600 dark:text-green-400">{resource.resource_type}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{resource.date}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteResource(resource.resource_id.toString())}>
                            Delete
                          </Button>
                        </div>
                      </div>
                      {!resource.resource_type?.toLowerCase().includes('video') && (
                        <a 
                          href={resource.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          <FileText className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeminarDetailsView;