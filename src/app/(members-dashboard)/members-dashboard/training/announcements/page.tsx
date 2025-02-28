"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Calendar, MapPin } from 'lucide-react';

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
}

interface Seminar {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: 'Ongoing' | 'Incoming' | 'Completed';
  resources: any[];
}

interface AnnouncementsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Announcement[];
  };
}

interface SeminarsResponse {
  status: string;
  message: string;
  data: Seminar[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SeminarAnnouncementsPage: React.FC = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch seminars
  const fetchSeminars = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/landing/seminars`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch seminars');
      }

      const data: SeminarsResponse = await response.json();
      if (data.status === "success") {
        // Filter only Ongoing or Upcoming seminars
        const activeSeminars = data.data.filter((seminar) => 
          seminar.status === "Ongoing" || seminar.status === "Incoming"
        );
        setSeminars(activeSeminars);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred while fetching seminars');
      console.error('Failed to fetch seminars:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch announcements for a specific seminar
  const fetchSeminarAnnouncements = async (seminarId: number) => {
    try {
      const response = await fetch(`${API_URL}/announcements/seminar/8-${seminarId}`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data: AnnouncementsResponse = await response.json();
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data)
          .flatMap(([date, announcements]) =>
            announcements.map((announcement) => ({
              ...announcement,
              date
            }))
          )
          .sort((a, b) => {
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateCompare === 0) {
              return new Date(`2000/01/01 ${b.time}`).getTime() - 
                     new Date(`2000/01/01 ${a.time}`).getTime();
            }
            return dateCompare;
          });
        
        setAnnouncements(formattedAnnouncements);
      } else {
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      setAnnouncements([]);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchSeminars();
    }
  }, [bearerToken]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">Loading seminars...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button 
            onClick={() => fetchSeminars()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Card>
    );
  }

  if (seminars.length === 0) {
    return (
      <div className="p-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">No Active Seminars</h3>
          <p className="text-muted-foreground">
            There are currently no ongoing or upcoming seminars. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Seminars & Announcements
        </h1>
        <p className="text-muted-foreground">
          Select a seminar to view its announcements
        </p>
      </div>

      {/* Seminars List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {seminars.map((seminar) => (
          <Card 
            key={seminar.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg
              ${selectedSeminar?.id === seminar.id ? 'border-2 border-primary' : ''}`}
            onClick={() => {
              setSelectedSeminar(seminar);
              fetchSeminarAnnouncements(seminar.id);
            }}
          >
            <CardHeader>
              <CardTitle className="text-lg line-clamp-2">{seminar.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{seminar.theme}</p>
              
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{seminar.date}</span>
              </div>
              
              {seminar.venue && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{seminar.venue}</span>
                </div>
              )}
              
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium
                ${seminar.status === 'Incoming' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
                }`}
              >
                {seminar.status}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Announcements Section */}
      {selectedSeminar && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Announcements for {selectedSeminar.title}
            </h2>
          </div>
          
          {announcements.length === 0 ? (
            <Card className="p-8">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-900">No Announcements Available</h3>
                {/* <p className="text-muted-foreground">
                  Make payment to view announcements or check back later for updates.
                </p> */}
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
                      {announcement.date} - {announcement.time}
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
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 5l7 7m0 0l-7 7m7-7H3" 
                          />
                        </svg>
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

export default SeminarAnnouncementsPage;