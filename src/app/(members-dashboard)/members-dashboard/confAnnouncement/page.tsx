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

const ConferenceAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [selectedConference, setSelectedConference] = useState<Conference | null>(null);

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

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

  useEffect(() => {
    if (bearerToken) {
      fetchConferences();
    }
  }, [bearerToken]);

  // Loading state
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

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Calendar className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900">No announcements</h3>
      <p className="text-gray-500 mt-1">
        There are no announcements to display at this time.
      </p>
    </div>
  );

  const handleViewAnnouncements = (conference: Conference) => {
    if (conference.is_registered) {
      setSelectedConference(conference);
      fetchAnnouncements(conference.id);
    } else {
      showToast.error("You need to register for this conference to view announcements.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary">Conference Announcements</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest news and information
          </p>
        </div>
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

      {/* Selected Conference Announcements */}
      {selectedConference && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Announcements for {selectedConference.title}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedConference(null)}
            >
              Back to Conferences
            </Button>
          </div>

          {announcements.length === 0 ? (
            <Card className="p-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-900">No Announcements Available</h3>
                <p className="text-muted-foreground">
                  There are no announcements for this conference yet.
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {announcements.map((announcement) => (
                <Card 
                  key={announcement.id} 
                  className="flex flex-col hover:shadow-xl transition-all duration-300"
                >
                  {announcement.image && (
                    <div className="relative w-full h-48">
                      <Image
                        src={typeof announcement.image === 'string'
                          ? announcement.image.startsWith('http')
                            ? announcement.image
                            : `${API_URL}/${announcement.image}`
                          : URL.createObjectURL(announcement.image as File)
                        }
                        alt={announcement.title}
                        fill
                        className="rounded-t-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-2">
                      {formatDate(announcement.date)} - {formatTime(announcement.time)}
                    </div>
                    <CardTitle className="line-clamp-2">{announcement.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground line-clamp-3">
                      {announcement.description}
                    </p>
                    {announcement.link && (
                      <a 
                        href={announcement.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-primary hover:underline mt-4"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConferenceAnnouncementsPage;