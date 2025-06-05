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
  viewer: 'members';
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

const MembersAnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { data: session } = useSession();
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements/member`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data as Record<string, Announcement[]>)
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

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Members Announcements</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <CardTitle className='flex items-center justify-between'>
                <span className='text-xl'>{announcement.title}</span>
              </CardTitle>
            </CardHeader>
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
                    target.onerror = null;
                    target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
            )}
            <CardContent>
              <p className='text-muted-foreground opacity-[0.8] text-sm md:text-md lg:text-lg'>
                {announcement.description}
              </p>
              {announcement.link && (
                <a 
                  href={announcement.link} 
                  target='_blank' 
                  rel='noopener noreferrer' 
                  className='text-blue-600 hover:underline flex items-center mt-2'
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MembersAnnouncementsPage;