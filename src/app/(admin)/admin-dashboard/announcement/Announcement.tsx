"use client";
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
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useSession } from "next-auth/react";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, ExternalLink, ChevronDown, ChevronRight, X, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, EditIcon } from 'lucide-react';
import Image from "next/image";
import { format } from 'date-fns';
import { showToast } from '@/utils/toast';
import { Badge } from "@/components/ui/badge";
import * as AlertDialog from '@radix-ui/react-alert-dialog';

// Color scheme for different viewer types
const VIEWER_COLORS = {
  all: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  members: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  conference: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  seminar: { bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200' },
  speaker: { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200' }
};

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

interface Conference {
  id: number;
  title: string;
  theme: string;
  venue: string;
  date: string;
  status: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    title: '',
    description: '',
    viewer: 'all'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoadingConferences, setIsLoadingConferences] = useState(false);

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_URL}/announcements/member`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data: { status: string; data: Record<string, Announcement[]> } = await response.json();
      
      if (data.status === "success" && data.data) {
        const formattedAnnouncements = Object.entries(data.data)
          .flatMap(([date, announcements]) =>
            announcements.map((announcement: Announcement) => ({
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
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      showToast.error("Failed to load announcements");
    }
  };

  const fetchConferences = async () => {
    setIsLoadingConferences(true);
    try {
      const response = await fetch(`${API_URL}/landing/events`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        setConferences(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conferences', error);
      showToast.error("Failed to load conferences");
    } finally {
      setIsLoadingConferences(false);
    }
  };

  useEffect(() => {
    if (bearerToken && isCreateModalOpen) {
      fetchConferences();
    }
  }, [bearerToken, isCreateModalOpen]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    try {
      if (!currentAnnouncement.title || !currentAnnouncement.description) {
        showToast.error("Please fill in all required fields");
        return;
      }
  
      formData.append('title', currentAnnouncement.title);
      formData.append('description', currentAnnouncement.description);
      formData.append('viewer', currentAnnouncement.viewer || 'all');
      
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
      
      if (!response.ok) throw new Error('Failed to create announcement');

      showToast.success("Announcement created successfully");
      fetchAnnouncements();
      setIsCreateModalOpen(false);
      resetForm();
    } catch (error) {
      showToast.error("Failed to create announcement");
    }
  };

  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    try {
      if (!currentAnnouncement.id) throw new Error("No announcement selected");
      
      formData.append('id', currentAnnouncement.id.toString());
      formData.append('title', currentAnnouncement.title || '');
      formData.append('description', currentAnnouncement.description || '');
      formData.append('viewer', currentAnnouncement.viewer || 'all');
      
      if (currentAnnouncement.image) {
        formData.append('image', currentAnnouncement.image);
      }
      if (currentAnnouncement.link) {
        formData.append('link', currentAnnouncement.link || '');
      }
      if (currentAnnouncement.linked_id) {
        formData.append('linked_id', currentAnnouncement.linked_id || '');
      }

      const response = await fetch(`${API_URL}/admin/edit_announcement/${currentAnnouncement.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        },
        body: formData
      });
      
      if (response.ok) {
        showToast.success("Announcement updated successfully");
        fetchAnnouncements();
        setIsEditModalOpen(false);
        resetForm();
      }
    } catch (error) {
      showToast.error("Failed to update announcement");
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    
    try {
      const response = await fetch(`${API_URL}/admin/delete_announcement`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: announcementToDelete })
      });
      
      if (response.ok) {
        showToast.success("Announcement deleted successfully");
        fetchAnnouncements();
        setDeleteDialogOpen(false);
      }
    } catch (error) {
      showToast.error("Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setCurrentAnnouncement({
      title: '',
      description: '',
      viewer: 'all',
      image: null,
      link: '',
      linked_id: ''
    });
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (bearerToken) fetchAnnouncements();
  }, [bearerToken]);

  const formatDateDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {announcements.length} total announcements
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon className="mr-2 h-4 w-4" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Announcement</DialogTitle>
              <DialogDescription>
                Share important updates with your members
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={currentAnnouncement.title}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    title: e.target.value
                  })}
                  placeholder="Announcement title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={currentAnnouncement.description}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    description: e.target.value
                  })}
                  placeholder="Detailed information about the announcement"
                  rows={5}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="viewer">Audience *</Label>
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
                      <SelectItem value="members">Members</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="speaker">Speakers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linked_id">Specific Conference (Optional)</Label>
                  <Select
                   value={currentAnnouncement.linked_id || undefined} 
                    onValueChange={(value) => setCurrentAnnouncement({
                      ...currentAnnouncement, 
                      linked_id: value
                    })}
                    disabled={isLoadingConferences}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isLoadingConferences ? "Loading conferences..." : "Select a conference"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {conferences.map((conference) => (
                        <SelectItem key={conference.id} value={conference.id.toString()}>
                          {conference.title} (ID: {conference.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="image-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                  >
                    <ImageIcon className="h-4 w-4" />
                    {currentAnnouncement.image ? 
                      (currentAnnouncement.image instanceof File ? 
                        currentAnnouncement.image.name : 
                        "Image selected") : 
                      "Choose image"}
                  </Label>
                  {currentAnnouncement.image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentAnnouncement({
                        ...currentAnnouncement,
                        image: null
                      })}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setCurrentAnnouncement({
                          ...currentAnnouncement,
                          image: e.target.files[0]
                        });
                      }
                    }}
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">External Link (Optional)</Label>
                <Input
                  id="link"
                  type="url"
                  value={currentAnnouncement.link || ''}
                  onChange={(e) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    link: e.target.value
                  })}
                  placeholder="https://example.com"
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Create Announcement</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {announcements.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500">No announcements found</p>
            <Button 
              variant="ghost" 
              className="mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create your first announcement
            </Button>
          </Card>
        ) : (
          announcements.map((announcement) => {
            const isExpanded = expandedIds.includes(announcement.id);
            const viewerColor = VIEWER_COLORS[announcement.viewer] || VIEWER_COLORS.all;
            
            return (
              <Card 
                key={announcement.id}
                className={`transition-all duration-200 overflow-hidden 
                  ${viewerColor.border} ${isExpanded ? 'shadow-md' : 'hover:shadow-sm'}`}
              >
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-accent/50"
                  onClick={() => toggleExpand(announcement.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="font-medium">{announcement.title}</h3>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={viewerColor.text}>
                      {announcement.viewer ? 
                        (announcement.viewer.charAt(0).toUpperCase() + announcement.viewer.slice(1)) : 
                        'All'}
                      {announcement.linked_id && ` (${announcement.linked_id})`}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDateDisplay(announcement.date)}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="animate-accordion-down">
                    {announcement.image && (
                      <div className="relative w-full h-64 border-t">
                        <Image
                          src={
                            typeof announcement.image === 'string'
                              ? announcement.image.startsWith('http') 
                                ? announcement.image 
                                : `${API_URL}/${announcement.image}`
                              : URL.createObjectURL(announcement.image)
                          }
                          alt={announcement.title}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-6 space-y-4">
                      <p className="text-muted-foreground whitespace-pre-line">
                        {announcement.description}
                      </p>
                      
                      {announcement.link && (
                        <Button 
                          variant="outline" 
                          asChild
                          className="w-fit"
                        >
                          <a 
                            href={announcement.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                          >
                            Learn More
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </CardContent>
                    
                    <CardFooter className="flex justify-end gap-2 border-t p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentAnnouncement(announcement);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAnnouncementToDelete(announcement.id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </CardFooter>
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to your announcement here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAnnouncement} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title *</Label>
              <Input
                id="edit-title"
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  title: e.target.value
                })}
                placeholder="Announcement title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description *</Label>
              <Textarea
                id="edit-description"
                value={currentAnnouncement.description}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  description: e.target.value
                })}
                placeholder="Detailed information about the announcement"
                rows={5}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-viewer">Audience *</Label>
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
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="speaker">Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-linked_id">Specific Conference (Optional)</Label>
                <Select
                value={currentAnnouncement.linked_id || undefined}
                  onValueChange={(value) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    linked_id: value
                  })}
                  disabled={isLoadingConferences}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingConferences ? "Loading conferences..." : "Select a conference"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {conferences.map((conference) => (
                      <SelectItem key={conference.id} value={conference.id.toString()}>
                        {conference.title} (ID: {conference.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="edit-image-upload"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                >
                  <ImageIcon className="h-4 w-4" />
                  {currentAnnouncement.image ? 
                    (currentAnnouncement.image instanceof File ? 
                      currentAnnouncement.image.name : 
                      "Image selected") : 
                    "Choose image"}
                </Label>
                {currentAnnouncement.image && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentAnnouncement({
                      ...currentAnnouncement,
                      image: null
                    })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                <Input
                  id="edit-image-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setCurrentAnnouncement({
                        ...currentAnnouncement,
                        image: e.target.files[0]
                      });
                    }
                  }}
                  accept="image/*"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-link">External Link (Optional)</Label>
              <Input
                id="edit-link"
                type="url"
                value={currentAnnouncement.link || ''}
                onChange={(e) => setCurrentAnnouncement({
                  ...currentAnnouncement, 
                  link: e.target.value
                })}
                placeholder="https://example.com"
              />
            </div>
            
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
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
                  onClick={handleDeleteAnnouncement}
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
  );
};

export default AnnouncementsPage;