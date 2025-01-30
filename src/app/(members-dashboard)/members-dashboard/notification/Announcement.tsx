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
import { Calendar, Clock, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// TypeScript interfaces
interface Announcement {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  file: string | null;
  link: string;
  image?: string | null;
}

interface AnnouncementsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Announcement[];
  };
}

const styles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite linear;
  }
`;



const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg min-h-[300px]">
    <Calendar className="w-16 h-16 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Announcements Yet</h3>
    <p className="text-gray-500">Check back later for updates and announcements.</p>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
  const formattedDate = new Date(announcement.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="hover:shadow-xl transition-all duration-300 relative h-full flex flex-col">
      <div className="absolute top-2 right-2 z-10 bg-black/50 text-white text-xs rounded-full px-3 py-1 flex items-center gap-1">
        <Clock className="w-3 h-3" />
        <span>{announcement.time}</span>
      </div>
      
      {announcement.image && (
        <div className="relative w-full h-48">
          <Image
            src={announcement.image}
            alt={announcement.title}
            fill
            className="object-cover rounded-t-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="text-lg md:text-xl line-clamp-2">
          {announcement.title}
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {announcement.description}
        </p>
        
        {announcement.link && (
          <a 
            href={announcement.link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors mt-auto group"
          >
            Learn More
            <ExternalLink className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        )}
      </CardContent>
    </Card>
  );
};
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm">
    {/* Image skeleton */}
    <div className="w-full h-48 skeleton" />
    
    {/* Content area */}
    <div className="p-6">
      {/* Title skeleton */}
      <div className="skeleton h-6 w-3/4 mb-4 rounded" />
      
      {/* Date skeleton */}
      <div className="skeleton h-4 w-1/3 mb-4 rounded" />
      
      {/* Description lines */}
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      
      {/* Link skeleton */}
      <div className="skeleton h-4 w-24 rounded mt-4" />
    </div>
  </div>
);

const SkeletonLoader: React.FC = () => (
  <>
    <style>{styles}</style>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  </>
);


const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchAnnouncements = async () => {
    if (!bearerToken) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/announcements`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data: AnnouncementsResponse = await response.json();
      
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data)
          .flatMap(([date, announcements]) => 
            announcements.map(announcement => ({
              ...announcement,
              date
            }))
          )
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        setAnnouncements(formattedAnnouncements);
      } else {
        throw new Error(data.message || 'Failed to fetch announcements');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Failed to fetch announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [bearerToken]);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-600 text-center">{error}</p>
        </div>
      );
    }

    if (announcements.length === 0) {
      return <EmptyState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <AnnouncementCard 
            key={announcement.id} 
            announcement={announcement}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Announcements
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with the latest news and information
          </p>
        </div>
      </div>
      {isLoading ? <SkeletonLoader /> : renderContent()}
    </div>
  );
};

export default AnnouncementsPage;