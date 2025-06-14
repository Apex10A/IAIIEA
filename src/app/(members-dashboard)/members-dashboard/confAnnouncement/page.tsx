"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useSession } from "next-auth/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ExternalLink, Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, EditIcon, TrashIcon, Loader2 } from 'lucide-react';
import Image from "next/image";
import { format, parseISO } from 'date-fns';
import { showToast } from '@/utils/toast';
import { useSearchParams } from 'next/navigation';

interface Announcement {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  file: string | null;
  link: string;
  image?: File | string | null;
  viewer: 'all' | 'members' | 'conference' | 'seminar' | 'speaker';
  linked_id?: string;
  conferenceTitle?: string;
}

interface AnnouncementsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Announcement[];
  };
}

interface ViewerBadgeProps {
  viewer: 'all' | 'members' | 'conference' | 'seminar' | 'speaker';
  linkedId?: string;
}

interface Conference {
  id: number;
  title: string;
  date: string;
  theme: string;
  is_registered: boolean;
}

interface ConferenceDetails {
  is_registered: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AnnouncementsPage: React.FC<{ loginResponse?: any }> = ({ loginResponse }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    id: undefined,
    title: '',
    description: '',
    image: null,
    link: '',
    viewer: 'all',
    linked_id: ''
  });
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<number | null>(null);
  const searchParams = useSearchParams();
  const conferenceId = searchParams.get('conferenceId');
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);
  const [conferenceDetails, setConferenceDetails] = useState<ConferenceDetails | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "announcements">("list");

  const bearerToken = session?.user?.token || session?.accessToken;

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  // Format time to 12-hour format
  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      const hourNum = parseInt(hours);
      const period = hourNum >= 12 ? 'PM' : 'AM';
      const displayHour = hourNum % 12 || 12;
      return `${displayHour}:${minutes} ${period}`;
    } catch {
      return timeString;
    }
  };

  const fetchConferences = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/landing/events`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      console.log('Conferences API response:', data); // Log the API response
      if (data.status === "success") {
        setConferences(data.data);
      } else {
        showToast.error("Failed to load conferences");
      }
    } catch (error) {
      console.error("Error fetching conferences:", error);
      showToast.error("Failed to load conferences");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnnouncements = async (conferenceId: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/announcements/conference/${conferenceId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data: AnnouncementsResponse = await response.json();
      console.log('Announcements API response:', data); // Log the API response
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data)
          .flatMap(([date, announcements]) =>
            announcements.map(announcement => ({
              ...announcement,
              date,
              conferenceTitle: data.data[date][0].conferenceTitle
            }))
          );
        setAnnouncements(formattedAnnouncements);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      setAnnouncements([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConferenceDetails = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/landing/event_details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch conference details");
      }

      const data = await response.json();
      setConferenceDetails(data.data);
    } catch (error) {
      console.error("Error fetching conference details:", error);
      showToast.error("Failed to load conference details");
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchConferences();
    }
  }, [bearerToken]);

  // Handle create announcement
  const handleCreateAnnouncement = async () => {
    try {
      const formData = new FormData();
      formData.append('title', currentAnnouncement.title || '');
      formData.append('description', currentAnnouncement.description || '');
      formData.append('viewer', currentAnnouncement.viewer || 'all');
      if (currentAnnouncement.image instanceof File) {
        formData.append('image', currentAnnouncement.image);
      }
      formData.append('link', currentAnnouncement.link || '');
      
      const response = await fetch(`${API_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });

      if (response.ok) {
        showToast.success('Announcement created successfully!');
        fetchAnnouncements(selectedConference?.id || 0);
        setIsCreateModalOpen(false);
        setCurrentAnnouncement({
          id: undefined,
          title: '',
          description: '',
          image: null,
          link: '',
          viewer: 'all',
          linked_id: ''
        });
      } else {
        throw new Error('Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      showToast.error('Failed to create announcement');
    }
  };

  // Handle delete announcement
  const handleDeleteAnnouncement = async () => {
    if (!selectedAnnouncementId) return;
    
    try {
      const response = await fetch(`${API_URL}/announcements/${selectedAnnouncementId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });

      if (response.ok) {
        showToast.success('Announcement deleted successfully!');
        fetchAnnouncements(selectedConference?.id || 0);
        setIsDeleteModalOpen(false);
        setSelectedAnnouncementId(null);
      } else {
        throw new Error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showToast.error('Failed to delete announcement');
    }
  };

  // Handle edit announcement
  const handleEditAnnouncement = async () => {
    if (!currentAnnouncement.id) return;
    
    
    try {
      const formData = new FormData();
      formData.append('title', currentAnnouncement.title || '');
      formData.append('description', currentAnnouncement.description || '');
      formData.append('viewer', currentAnnouncement.viewer || 'all');
      if (currentAnnouncement.image instanceof File) {
        formData.append('image', currentAnnouncement.image);
      }
      formData.append('link', currentAnnouncement.link || '');
      
      const response = await fetch(`${API_URL}/announcements/${currentAnnouncement.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });

      if (response.ok) {
        showToast.success('Announcement updated successfully!');
        fetchAnnouncements(selectedConference?.id || 0);
        setIsEditModalOpen(false);
        setCurrentAnnouncement({
          id: undefined,
          title: '',
          description: '',
          image: null,
          link: '',
          viewer: 'all',
          linked_id: ''
        });
      } else {
        throw new Error('Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      showToast.error('Failed to update announcement');
    }
  };

  // Viewer badge component using Radix UI primitives
  const ViewerBadge: React.FC<ViewerBadgeProps> = ({ viewer, linkedId }) => {
    const getBadgeColor = () => {
      if (!viewer) return 'bg-gray-100 text-gray-800';
     
      switch (viewer) {
        case 'all': return 'bg-green-100 text-green-800';
        case 'members': return 'bg-yellow-100 text-yellow-800';
        case 'conference': return 'bg-blue-100 text-blue-800';
        case 'seminar': return 'bg-purple-100 text-purple-800';
        case 'speaker': return 'bg-orange-100 text-orange-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const displayText = viewer 
      ? viewer.charAt(0).toUpperCase() + viewer.slice(1)
      : 'Unknown';

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeColor()}`}>
        {displayText}
        {linkedId && ` (${linkedId})`}
      </span>
    );
  };

  // Loading state using basic divs
  const LoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-t-lg"></div>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 mt-2"></div>
          </CardContent>
          <CardFooter>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  // Empty state using basic divs
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No announcements</h3>
      <p className="text-gray-500 mt-1">
        There are no announcements to display at this time.
      </p>
      {/* <Button className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
        <PlusIcon className="h-4 w-4 mr-2" />
        Create Announcement
      </Button> */}
    </div>
  );

  const handleViewAnnouncements = async (conference: Conference) => {
    setSelectedConference(conference);
    await fetchConferenceDetails(conference.id);
    
    if (!conferenceDetails?.is_registered) {
      showToast.error("You need to register for this conference to view announcements.");
    } else {
      await fetchAnnouncements(conference.id);
      setViewMode("announcements");
    }
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedConference(null);
    setConferenceDetails(null);
    setAnnouncements([]);
  };

  if (viewMode === "announcements" && selectedConference) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Button
              onClick={handleBackToList}
              variant="outline"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to conferences
            </Button>
          </div>

          <div className="bg-card rounded-lg shadow-md p-4 sm:p-6 border dark:border-gray-700">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {selectedConference.title}
              </h1>
              <p className="text-gray-700 dark:text-gray-400 mt-1">
                {selectedConference.theme}
              </p>
            </div>

            {isLoading ? (
              <LoadingState />
            ) : announcements.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-10 h-10 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  No announcements yet
                </h3>
                <p className="text-gray-700 dark:text-gray-400">
                  There are no announcements for this conference at the moment.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(announcements.reduce((acc, announcement) => {
                  const date = announcement.date;
                  if (!acc[date]) acc[date] = [];
                  acc[date].push(announcement);
                  return acc;
                }, {} as Record<string, typeof announcements>)).map(([date, dateAnnouncements]) => (
                  <div key={date} className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {date}
                    </h2>
                    <div className="grid gap-4">
                      {dateAnnouncements.map((announcement) => (
                        <Card key={announcement.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                {announcement.title}
                              </h3>
                              <p className="text-sm text-gray-700 dark:text-gray-400">
                                {announcement.description}
                              </p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Clock className="w-4 h-4" />
                                <span>{announcement.time}</span>
                              </div>
                            </div>
                            {announcement.file && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-2"
                                onClick={() => window.open(`${API_URL}/${announcement.file}`, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                                View File
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Conference Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest news and information
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            {/* <Button className="gap-2">
              <PlusIcon size={16} />
              Create Announcement
            </Button> */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              {/* <DialogTitle>Create New Announcement</DialogTitle> */}
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={currentAnnouncement.description}
                  onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, description: e.target.value})}
                  placeholder="Enter announcement description"
                  rows={5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    image: e.target.files?.[0] || null
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Link (Optional)</Label>
                <Input
                  id="link"
                  value={currentAnnouncement.link}
                  onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, link: e.target.value})}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="viewer">Audience</Label>
                <Select
                  value={currentAnnouncement.viewer}
                  onValueChange={(value) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    viewer: value as 'all' | 'members' | 'conference' | 'seminar' | 'speaker'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="members">Members Only</SelectItem>
                    <SelectItem value="conference">Conference Attendees</SelectItem>
                    <SelectItem value="seminar">Seminar Attendees</SelectItem>
                    <SelectItem value="speaker">Speakers Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* <DialogFooter>
              <Button 
                onClick={handleCreateAnnouncement}
                disabled={!currentAnnouncement.title || !currentAnnouncement.description}
              >
                Create Announcement
              </Button>
            </DialogFooter> */}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : conferences && conferences.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {conferences && conferences.map((conference) => (
            <Card 
              key={conference.id} 
              className="hover:shadow-lg transition-all duration-300 h-full flex flex-col"
            >
              <CardHeader>
                <CardTitle className="text-xl text-primary">{conference.title}</CardTitle>
                <div className="flex items-center text-sm text-muted-foreground gap-2">
                  <Calendar size={14} />
                  <span>{conference.date}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground line-clamp-3">
                  {conference.theme}
                </p>
                {selectedConference?.id === conference.id && !conferenceDetails?.is_registered && (
                  <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          You need to register for this conference to view announcements.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewAnnouncements(conference)}
                >
                  View Announcements
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, title: e.target.value})}
                placeholder="Enter announcement title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={currentAnnouncement.description}
                onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, description: e.target.value})}
                placeholder="Enter announcement description"
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image (Optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  image: e.target.files?.[0] || null
                })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-link">Link (Optional)</Label>
              <Input
                id="edit-link"
                value={currentAnnouncement.link}
                onChange={(e) => setCurrentAnnouncement({...currentAnnouncement, link: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-viewer">Audience</Label>
              <Select
                value={currentAnnouncement.viewer}
                onValueChange={(value) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  viewer: value as 'all' | 'members' | 'conference' | 'seminar' | 'speaker'
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="members">Members Only</SelectItem>
                  <SelectItem value="conference">Conference Attendees</SelectItem>
                  <SelectItem value="seminar">Seminar Attendees</SelectItem>
                  <SelectItem value="speaker">Speakers Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleEditAnnouncement}
              disabled={!currentAnnouncement.title || !currentAnnouncement.description}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AnnouncementsPage;