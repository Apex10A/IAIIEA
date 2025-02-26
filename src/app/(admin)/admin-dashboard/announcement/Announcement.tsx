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
import { Trash2, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
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
      const response = await fetch(`${API_URL}/announcements/member`, {
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

  // Create announcement
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    try {
      // Validate required fields
      if (!currentAnnouncement.title || !currentAnnouncement.description || !currentAnnouncement.viewer) {
        showToast.error("Please fill in all required fields");
        return;
      }
  
      // Append all fields to formData
      formData.append('title', currentAnnouncement.title);
      formData.append('description', currentAnnouncement.description);
      formData.append('viewer', currentAnnouncement.viewer);
      
      if (currentAnnouncement.image) {
        formData.append('image', currentAnnouncement.image);
      }
      if (currentAnnouncement.link) {
        formData.append('link', currentAnnouncement.link);
      }
      if (currentAnnouncement.linked_id) {
        formData.append('linked_id', currentAnnouncement.linked_id);
      }
  
      const response = await fetch(`${API_URL}/admin/create_announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to create announcement');
      }
  
      showToast.success("Announcement created successfully");
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
    } catch (error) {
      console.error('Failed to create announcement', error);
      showToast.error("Failed to create announcement");
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
      const response = await fetch(`${API_URL}/admin/delete_announcement`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'  // Important since we're sending a JSON body
        },
        body: JSON.stringify({ id })  // Send ID in request body
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete announcement');
      }
  
      showToast.success("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error('Failed to delete announcement:', error);
      showToast.error("Failed to delete announcement");
    }
  };
  const toggleExpand = (id: number) => {
    setExpandedIds((prev: number[]) => 
      prev.includes(id) 
        ? prev.filter((itemId: number) => itemId !== id) 
        : [...prev, id]
    );
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
        <h1 className="text-xl md:text-2xl font-bold text-gray-700">Members Announcements</h1>
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
  <SelectItem value="members">Members</SelectItem>  {/* Add this */}
  <SelectItem value="conference">Conference Participants</SelectItem>
  <SelectItem value="seminar">Seminar Participants</SelectItem>
  <SelectItem value="speaker">Speakers</SelectItem>
</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Linked ID (Conference ID you want to send announcement to)</Label>
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

      <div className='space-y-4 w-full'>
      {announcements.map((announcement) => {
        const isExpanded = expandedIds.includes(announcement.id);
        
        return (
          <Card 
            key={announcement.id} 
            className={`transition-all duration-300 overflow-hidden
              ${announcement.viewer === 'all' ? 'border-l-4 border-l-green-500' : ''}
              ${announcement.viewer === 'conference' ? 'border-l-4 border-l-blue-500' : ''}
              ${announcement.viewer === 'seminar' ? 'border-l-4 border-l-purple-500' : ''}
              ${announcement.viewer === 'speaker' ? 'border-l-4 border-l-orange-500' : ''}
              ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
          >
            <div 
              className='flex items-center justify-between p-4 cursor-pointer'
              onClick={() => toggleExpand(announcement.id)}
            >
              <div className='flex items-center space-x-3'>
                {isExpanded ? 
                  <ChevronDown className='h-5 w-5 text-gray-500' /> : 
                  <ChevronRight className='h-5 w-5 text-gray-500' />
                }
                <p className='font-medium text-lg'>{announcement.title}</p>
              </div>
              
              <div className='flex items-center space-x-4'>
                <ViewerBadge viewer={announcement.viewer} linkedId={announcement.linked_id} />
                <span className='text-sm text-muted-foreground italic'>
                  {announcement.date}
                </span>
              </div>
            </div>
            
            {isExpanded && (
              <div className='animate-accordion-down'>
                {announcement.image && (
                  <div className="relative w-full h-64">
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
                
                <CardContent className='pt-4'>
                  <p className='text-muted-foreground text-sm mb-6'>
                    {announcement.description}
                  </p>
                  
                  <div className='flex justify-between items-center'>
                    {announcement.link && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        asChild
                      >
                        <a 
                          href={announcement.link} 
                          target='_blank' 
                          rel='noopener noreferrer'
                          className='flex items-center'
                        >
                          Learn More
                          <ExternalLink className='ml-2 h-3 w-3' />
                        </a>
                      </Button>
                    )}
                    
                    <div className='flex space-x-2'>
                      <Button 
                        variant='outline' 
                        size='icon'
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentAnnouncement(announcement);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon className='h-4 w-4' />
                      </Button>
                      
                      <AlertDialog.Root>
  <AlertDialog.Trigger asChild>
    <button  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2">
      <Trash2 className="w-4 h-4" />
      <span>Delete</span>
    </button>
  </AlertDialog.Trigger>
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="bg-black/50 fixed inset-0" />
    <AlertDialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-6 shadow-lg">
      <AlertDialog.Title className="text-lg font-semibold">
        Delete Announcement 
      </AlertDialog.Title>
      <AlertDialog.Description className="mt-3 mb-5 text-sm text-gray-600">
        Are you sure you want to delete this Announcement? This action cannot be undone.
      </AlertDialog.Description>
      <div className="flex justify-end gap-4">
        <AlertDialog.Cancel asChild>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">
            Cancel
          </button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <button 
          onClick={() => handleDeleteAnnouncement(announcement.id)}
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
                  </div>
                </CardContent>
              </div>
            )}
          </Card>
        );
      })}
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
              <Label>Linked ID (Conference ID you want to send announcement to)</Label>
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