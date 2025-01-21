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
import ButtonProp from '@/app/(members-dashboard)/members-dashboard/notification/button';
import { useSession } from "next-auth/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import Image from "next/image"

// Define the Announcement type
interface Announcement {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  file: string | null;
  link: string;
  image?: File | string | null;
}

// Define the API response type
interface AnnouncementsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Announcement[];
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Jobs: React.FC<{ loginResponse?: any }> = ({ loginResponse }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [selectedSection, setSelectedSection] = useState('Announcement');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    id: undefined,
    title: '',
    description: '',
    image: null,
    link: ''
  });

  // Extract token from loginResponse
  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data: AnnouncementsResponse = await response.json();
      
      if (data.status === "success" && data.data) {
        // Transform the data to include date information
        const formattedAnnouncements = Object.entries(data.data).flatMap(([date, announcements]) => 
          announcements.map(announcement => ({
            ...announcement,
            date // Add the date to each announcement
          }))
        );
        
        // Sort announcements by date (most recent first)
        formattedAnnouncements.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        
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
    <div className=''>
      <div className='flex justify-between items-center mb-6'>
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        {/* <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className='mr-2' /> Create Jobs
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Jobs</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className='space-y-4'>
              <div>
                <Label>Title</Label>
                <Input 
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    title: e.target.value
                  })}
                  required 
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea 
                  value={currentAnnouncement.description}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    description: e.target.value
                  })}
                  required 
                />
              </div>
              <div>
                <Label>Image</Label>
                <Input 
                  type='file'
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    image: e.target.files[0]
                  })}
                />
              </div>
              <div>
                <Label>Link (Optional)</Label>
                <Input 
                  value={currentAnnouncement.link}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    link: e.target.value
                  })}
                />
              </div>
              <Button type='submit' className='w-full'>Create Jobs</Button>
            </form>
          </DialogContent>
        </Dialog> */}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
  {announcements.map((announcement) => (
    <Card 
      key={announcement.id} 
      className=' hover:shadow-xl transition-all duration-300 relative'
    >
        <div className='absolute top-2 right-2 text-sm text-muted-foreground'>
        <span className='opacity-[0.6] italic'>{announcement.date} - {announcement.time}</span>
      </div>
      
      {announcement.image && (
        <div className='relative '>
          <Image
      src={typeof announcement.image === 'string' 
        ? announcement.image 
        : URL.createObjectURL(announcement.image)}
      alt={announcement.title || 'Announcement image'} 
      className="w-full h-48 object-cover" 
    />
          <div className='absolute top-0 left-0 w-full h-full bg-black opacity-20 hover:opacity-10 transition-opacity'></div>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className='flex items-center pt-5'>
          <span className='text-xl'>{announcement.title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className='text-muted-foreground opacity-[0.8]'>
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
          
          <div className='flex space-x-2'>
            <Button 
              variant='outline' 
              size='icon'
              onClick={() => {
                setCurrentAnnouncement(announcement);
                setIsEditModalOpen(true);
              }}
            >
              <EditIcon className='h-4 w-4' />
            </Button>
            <Button 
              variant='destructive' 
              size='icon'
            //   onClick={() => handleDeleteAnnouncement(announcement.id)}
            >
              <TrashIcon className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ))}
</div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
          </DialogHeader>
          <form  className='space-y-4'>
            <div>
              <Label>Title</Label>
              <Input 
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  title: e.target.value
                })}
                required 
              />
            </div>
             <div>
              <Label>Description</Label>
              <Textarea 
                value={currentAnnouncement.description}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  description: e.target.value
                })}
                required 
              />
            </div>
            <div>
        <Label>ID</Label>
        <Input 
          type="text"
          value={currentAnnouncement.id || ''}
          onChange={(e) => setCurrentAnnouncement({
            ...currentAnnouncement, 
            id: Number(e.target.value) // Convert to number
          })}
          required 
        />
      </div>
            <div>
            <Label>Image</Label>
              <Input 
  type="file"
  onChange={(e) => {
    if (e.target.files && e.target.files[0]) {
      setCurrentAnnouncement({
        ...currentAnnouncement, 
        image: e.target.files[0]
      });
    }
  }}
/>
            </div>
            <div>
              <Label>Link (Optional)</Label>
              <Input 
                value={currentAnnouncement.link || ''}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  link: e.target.value
                })}
              />
            </div>
            <Button type='submit' className='w-full'>Update Announcement</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;