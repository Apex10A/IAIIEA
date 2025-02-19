"use client"
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { useSession } from "next-auth/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import Image from "next/image";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { showToast } from '@/utils/toast';


// Update the Announcement interface
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
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AnnouncementsPage: React.FC<{ loginResponse?: any }> = ({ loginResponse }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    id: undefined,
    title: '',
    description: '',
    image: null,
    link: '',
    viewer: 'all',
    linked_id: ''
  });

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements/conference/9`, {
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
              date
            }))
          )
          // Sort by date and time
          .sort((a, b) => {
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateCompare === 0) {
              // If same date, sort by time
              return new Date(`2000/01/01 ${b.time}`).getTime() - 
                     new Date(`2000/01/01 ${a.time}`).getTime();
            }
            return dateCompare;
          });
        
        setAnnouncements(formattedAnnouncements);
      } else {
        console.error('Invalid data structure:', data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      setAnnouncements([]);
    }
  };


  useEffect(() => {
    if (bearerToken) {
      fetchAnnouncements();
    }
  }, [bearerToken]);

  
  // Helper function to render viewer badge
// Update the ViewerBadge component with proper type checking
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

  // Add null check and provide default text
  const displayText = viewer 
    ? viewer.charAt(0).toUpperCase() + viewer.slice(1)
    : 'Unknown';

  return (
    <span className={`px-2 py-1 rounded ${getBadgeColor()}`}>
      {displayText}
      {linkedId && ` (${linkedId})`}
    </span>
  );
};
  return (
    <div className=''>
      <div className='md:flex justify-between items-center mb-6'>
        <h1 className="text-xl md:text-2xl font-bold text-gray-700">Conference Announcements</h1>
      
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className={`hover:shadow-xl transition-all duration-300 relative
              ${announcement.viewer === 'all' ? 'border-green-200' : ''}
      ${announcement.viewer === 'conference' ? 'border-blue-200' : ''}
      ${announcement.viewer === 'seminar' ? 'border-purple-200' : ''}
      ${announcement.viewer === 'speaker' ? 'border-orange-200' : ''}`}
            
          >
            <div className='absolute top-2 right-2 text-sm text-muted-foreground'>
              <span className='opacity-[0.6] italic'>{announcement.date} - {announcement.time}</span>
            </div>
            
            {announcement.image && (
  <div className="relative w-full h-48">
    <Image
      src={
        typeof announcement.image === 'string'
          ? announcement.image.startsWith('http') 
            ? announcement.image 
            : `${API_URL}/${announcement.image}`
          : URL.createObjectURL(announcement.image as File)
      }
      alt={announcement.title || 'Announcement image'}
      fill
      style={{ objectFit: 'cover' }}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null; // Prevent infinite callback loop
        target.src = '/placeholder-image.jpg'; // Replace with your placeholder image path
      }}
    />
  </div>
)}
            
            <CardHeader>
              <CardTitle className='flex items-center justify-between pt-5'>
                <span className='text-xl'>{announcement.title}</span>
                <ViewerBadge viewer={announcement.viewer} linkedId={announcement.linked_id} />
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <p className='text-muted-foreground opacity-[0.8] text-sm md:text-md lg:text-lg'>
                {announcement.description}
              </p>
              
              <div className='flex justify-between items-center pt-2'>
                {announcement.link && (
                  <a 
                    href={announcement.link} 
                    target='_blank' 
                    rel='noopener noreferrer' 
                    className='text-blue-600 hover:underline flex items-center'
                  >
                    Learn More
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className='ml-1 h-4 w-4' 
                      fill='none' 
                      viewBox='0 0 24 24' 
                      stroke='currentColor'
                    >
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 7l5 5m0 0l-5 5m5-5H6' />
                    </svg>
                  </a>
                )}
                
              
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

  
     
    </div>
  );
};

export default AnnouncementsPage;