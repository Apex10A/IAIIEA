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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, EditIcon, TrashIcon } from 'lucide-react';
import Image from "next/image";

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
  viewer: 'all' | 'conference' | 'seminar' | 'speaker';
  linked_id?: string;
}

interface AnnouncementsResponse {
  status: string;
  message: string;
  data: {
    [date: string]: Announcement[];
  };
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
      const response = await fetch(`${API_URL}/announcements`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data: AnnouncementsResponse = await response.json();
      
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data).flatMap(([date, announcements]) => 
          announcements.map(announcement => ({
            ...announcement,
            date
          }))
        );
        
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

  // Create announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (currentAnnouncement.title) {
      formData.append('title', currentAnnouncement.title);
    }
    if (currentAnnouncement.description) {
      formData.append('description', currentAnnouncement.description);
    }
    if (currentAnnouncement.image) {
      formData.append('image', currentAnnouncement.image);
    }
    if (currentAnnouncement.link) {
      formData.append('link', currentAnnouncement.link);
    }
    // Add new fields
    if (currentAnnouncement.viewer) {
      formData.append('viewer', currentAnnouncement.viewer);
    }
    if (currentAnnouncement.linked_id) {
      formData.append('linked_id', currentAnnouncement.linked_id);
    }

    try {
      const response = await fetch(`${API_URL}/admin/create_announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      if (response.ok) {
        fetchAnnouncements();
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
      }
    } catch (error) {
      console.error('Failed to create announcement', error);
    }
  };

  // Edit announcement
  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (currentAnnouncement.id !== undefined) {
      formData.append('id', currentAnnouncement.id.toString());
    }
    if (currentAnnouncement.title) {
      formData.append('title', currentAnnouncement.title);
    }
    if (currentAnnouncement.description) {
      formData.append('description', currentAnnouncement.description);
    }
    if (currentAnnouncement.image) {
      formData.append('image', currentAnnouncement.image);
    }
    if (currentAnnouncement.link) {
      formData.append('link', currentAnnouncement.link);
    }
    // Add new fields
    if (currentAnnouncement.viewer) {
      formData.append('viewer', currentAnnouncement.viewer);
    }
    if (currentAnnouncement.linked_id) {
      formData.append('linked_id', currentAnnouncement.linked_id);
    }

    try {
      const response = await fetch(`${API_URL}/admin/edit_announcement/${currentAnnouncement.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      if (response.ok) {
        fetchAnnouncements();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to edit announcement', error);
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/admin/delete_announcement/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      if (response.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error('Failed to delete announcement', error);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchAnnouncements();
    }
  }, [bearerToken]);

  // Helper function to render viewer badge
// Update the ViewerBadge component with proper type checking
const ViewerBadge: React.FC<{ viewer: string, linkedId?: string }> = ({ viewer, linkedId }) => {
  const getBadgeColor = () => {
    if (!viewer) return 'bg-gray-100 text-gray-800'; // Default color if viewer is undefined
    
    switch (viewer) {
      case 'all': return 'bg-green-100 text-green-800';
      case 'conference': return 'bg-blue-100 text-blue-800';
      case 'seminar': return 'bg-purple-100 text-purple-800';
      case 'speaker': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Add null check before rendering
  if (!viewer) return null; // Don't render badge if no viewer

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeColor()}`}>
      {`${viewer.charAt(0).toUpperCase()}${viewer.slice(1)}`}
      {linkedId && ` (ID: ${linkedId})`}
    </span>
  );
};
  return (
    <div className=''>
      <div className='md:flex justify-between items-center mb-6'>
        <h1 className="text-xl md:text-2xl font-bold text-gray-700">Announcements</h1>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <PlusIcon className='mr-2' /> Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className='space-y-4 bg-white'>
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
                <Label>Viewer</Label>
                <Select 
                  value={currentAnnouncement.viewer}
                  onValueChange={(value) => setCurrentAnnouncement({
                    ...currentAnnouncement,
                    viewer: value as 'all' | 'conference' | 'seminar' | 'speaker'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select viewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="conference">Members</SelectItem>
                    <SelectItem value="conference">Conference Participants</SelectItem>
                    <SelectItem value="seminar">Seminar Participants</SelectItem>
                    <SelectItem value="speaker">Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linked ID (Optional)</Label>
                <Input 
                  value={currentAnnouncement.linked_id}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    linked_id: e.target.value
                  })}
                  placeholder="Enter specific ID if needed"
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
                  value={currentAnnouncement.link}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    link: e.target.value
                  })}
                />
              </div>
              <Button type='submit' className='w-full'>Create Announcement</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {announcements.map((announcement) => (
          <Card 
            key={announcement.id} 
            className='hover:shadow-xl transition-all duration-300 relative'
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
                
                <div className='flex space-x-2'>
                  <Button 
                    variant='outline' 
                    className='bg-transparent border'
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
                    onClick={() => handleDeleteAnnouncement(announcement.id)}
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
          <form onSubmit={handleEditAnnouncement} className='space-y-4 bg-white'>
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
              <Label>Viewer</Label>
              <Select 
                value={currentAnnouncement.viewer}
                onValueChange={(value) => setCurrentAnnouncement({
                  ...currentAnnouncement,
                  viewer: value as 'all' | 'conference' | 'seminar' | 'speaker'
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select viewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="conference">Conference Participants</SelectItem>
                  <SelectItem value="seminar">Seminar Participants</SelectItem>
                  <SelectItem value="speaker">Speakers</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Linked ID (Optional)</Label>
              <Input 
                value={currentAnnouncement.linked_id}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  linked_id: e.target.value
                })}
                placeholder="Enter specific ID if needed"
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

export default AnnouncementsPage;