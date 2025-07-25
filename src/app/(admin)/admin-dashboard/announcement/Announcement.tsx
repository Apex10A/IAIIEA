"use client";
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import "./index.css"
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
import { Trash2, ExternalLink, ChevronDown, ChevronRight, X, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, EditIcon } from 'lucide-react';
import Image from "next/image";
import { format } from 'date-fns';
import { showToast } from '@/utils/toast';
import { Badge } from "@/components/ui/badge";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { Progress } from "@/components/ui/progress";
import type { ComponentProps } from "react";

const VIEWER_COLORS = {
  all: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
  member: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
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
  viewer: 'all' | 'member' | 'conference' | 'seminar' | 'speaker';
  linked_id?: string;
  linked_title?: string;
  images?: (string | File)[];
}

type AnnouncementFormData = Partial<Announcement> & {
  images?: (string | File)[];
};

interface Conference {
  id: number;
  title: string;
}

interface Seminar {
  id: number;
  title: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementFormData>({
    title: '',
    description: '',
    viewer: 'all',
    images: []
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<number | null>(null);
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeViewer, setActiveViewer] = useState<'all' | 'member' | 'conference' | 'seminar' | 'speaker'>('all');
  const [isFetchingLinkedData, setIsFetchingLinkedData] = useState(false);

  const bearerToken = session?.user?.token || session?.user?.userData?.token;

  const fetchAnnouncements = async (viewer?: string, id?: string) => {
    try {
      setIsLoading(true);
      let url = `${API_URL}/announcements`;
      
      if (viewer) {
        url = `${API_URL}/announcements/${viewer}`;
        if (id && (viewer === 'conference' || viewer === 'seminar')) {
          url = `${API_URL}/announcements/${viewer}/${id}`;
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      
      const data = await response.json();
      
      if (data.status === "success") {
        // Handle empty data case
        if (!data.data || Object.keys(data.data).length === 0) {
          setAnnouncements([]);
          return;
        }
  
        const formattedAnnouncements = Object.entries(data.data)
          .flatMap(([date, announcements]: [string, any]) => {
            // Handle case where announcements array might be empty for a date
            if (!Array.isArray(announcements) || announcements.length === 0) {
              return [];
            }
            return announcements.map((announcement: any) => ({
              ...announcement,
              date,
              images: announcement.file ? [announcement.file] : [],
              viewer: viewer || 'all' // Ensure viewer type is set
            }));
          })
          .sort((a: Announcement, b: Announcement) => {
            const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
            if (dateCompare === 0) {
              return b.time.localeCompare(a.time);
            }
            return dateCompare;
          });
        
        setAnnouncements(formattedAnnouncements);
      }
    } catch (error) {
      console.error('Failed to fetch announcements', error);
      showToast.error("Failed to load announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchConferences = async () => {
    try {
      setIsFetchingLinkedData(true);
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
      setIsFetchingLinkedData(false);
    }
  };

  const fetchSeminars = async () => {
    try {
      setIsFetchingLinkedData(true);
      const response = await fetch(`${API_URL}/landing/seminars`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`
        }
      });
      const data = await response.json();
      if (data.status === "success") {
        setSeminars(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch seminars', error);
      showToast.error("Failed to load seminars");
    } finally {
      setIsFetchingLinkedData(false);
    }
  };

  useEffect(() => {
    if (bearerToken) {
      fetchAnnouncements();
    }
  }, [bearerToken]);

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentAnnouncement.title || !currentAnnouncement.description) {
        showToast.error("Please fill in all required fields");
        return;
      }

      const formData = new FormData();
      formData.append('title', currentAnnouncement.title);
      formData.append('description', currentAnnouncement.description);
      formData.append('viewer', currentAnnouncement.viewer || 'all');

      // Append files
      if (currentAnnouncement.images && currentAnnouncement.images.length > 0) {
        currentAnnouncement.images.forEach((image: any) => {
          if (image instanceof File) {
            formData.append('file', image);
          }
        });
      }

      if (currentAnnouncement.link) {
        formData.append('link', currentAnnouncement.link);
      }
      if (currentAnnouncement.linked_id) {
        formData.append('linked_id', currentAnnouncement.linked_id);
      }

      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch(`${API_URL}/admin/create_announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create announcement');
      }

      setSuccessMessage(data.message || 'Announcement created successfully');
      setIsSuccessModalOpen(true);
      
      await fetchAnnouncements(activeViewer, currentAnnouncement.linked_id);
      setIsCreateModalOpen(false);
      resetForm();

    } catch (error: any) {
      console.error('Error creating announcement:', error);
      showToast.error(error.message || "Failed to create announcement");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEditAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!currentAnnouncement.id) {
        throw new Error("No announcement selected for editing");
      }

      const formData = new FormData();
      formData.append('id', currentAnnouncement.id.toString());
      formData.append('title', currentAnnouncement.title || '');
      formData.append('description', currentAnnouncement.description || '');
      formData.append('viewer', currentAnnouncement.viewer || 'all');

      // Append files
      if (currentAnnouncement.images) {
        currentAnnouncement.images.forEach((image: any) => {
          if (image instanceof File) {
            formData.append('file', image);
          } else if (typeof image === 'string') {
            formData.append('existing_images', image);
          }
        });
      }

      if (currentAnnouncement.link) {
        formData.append('link', currentAnnouncement.link);
      }
      if (currentAnnouncement.linked_id) {
        formData.append('linked_id', currentAnnouncement.linked_id);
      }

      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch(`${API_URL}/admin/edit_announcement`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update announcement');
      }

      setSuccessMessage(data.message || 'Announcement updated successfully');
      setIsSuccessModalOpen(true);
      
      await fetchAnnouncements(activeViewer, currentAnnouncement.linked_id);
      setIsEditModalOpen(false);
      resetForm();

    } catch (error: any) {
      console.error('Error updating announcement:', error);
      showToast.error(error.message || "Failed to update announcement");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
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
      
      const data = await response.json();

      if (response.ok) {
        showToast.success(data.message || "Announcement deleted successfully");
        fetchAnnouncements(activeViewer, currentAnnouncement.linked_id);
        setDeleteDialogOpen(false);
      } else {
        throw new Error(data.message || 'Failed to delete announcement');
      }
    } catch (error: any) {
      showToast.error(error.message || "Failed to delete announcement");
    }
  };

  const resetForm = () => {
    setCurrentAnnouncement({
      title: '',
      description: '',
      viewer: 'all',
      images: [],
      link: '',
      linked_id: ''
    });
    setUploadProgress(0);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files);
      setCurrentAnnouncement(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setCurrentAnnouncement(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const formatDateDisplay = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const getImageUrl = (image: string | File) => {
    if (typeof image === 'string') {
      return image.startsWith('http') ? image : `${API_URL}/${image}`;
    }
    return URL.createObjectURL(image);
  };

  const filteredAnnouncements = activeViewer === 'all' 
    ? announcements 
    : announcements.filter(a => a.viewer === activeViewer);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header and Create Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-500">
            {filteredAnnouncements.length} announcements for {activeViewer}
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <PlusIcon className="mr-2 h-4 w-4 text-[#000]" />
              <span className='text-[#000]'>New Announcement</span>
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
                    onValueChange={async (value) => {
                      const viewer = value as 'all' | 'member' | 'conference' | 'seminar' | 'speaker';
                      setCurrentAnnouncement({
                        ...currentAnnouncement,
                        viewer,
                        linked_id: ''
                      });

                      if (viewer === 'conference') {
                        await fetchConferences();
                      } else if (viewer === 'seminar') {
                        await fetchSeminars();
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="member">Members</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="seminar">Seminar</SelectItem>
                      <SelectItem value="speaker">Speakers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linked_id">
                    {currentAnnouncement.viewer === 'conference' ? 'Select Conference' : 
                     currentAnnouncement.viewer === 'seminar' ? 'Select Seminar' : 
                     'Linked Item'}
                  </Label>
                  <Select
                    value={currentAnnouncement.linked_id || "none"}
                    onValueChange={(value) => setCurrentAnnouncement({
                      ...currentAnnouncement, 
                      linked_id: value === "none" ? "" : value
                    })}
                    disabled={!['conference', 'seminar'].includes(currentAnnouncement.viewer || '') || isFetchingLinkedData}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        isFetchingLinkedData ? "Loading..." :
                        currentAnnouncement.viewer === 'conference' ? "Select a conference" :
                        currentAnnouncement.viewer === 'seminar' ? "Select a seminar" :
                        "Not applicable"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {currentAnnouncement.viewer === 'conference' && conferences.map((conference) => (
                        <SelectItem key={conference.id} value={conference.id.toString()}>
                          {conference.title}
                        </SelectItem>
                      ))}
                      {currentAnnouncement.viewer === 'seminar' && seminars.map((seminar) => (
                        <SelectItem key={seminar.id} value={seminar.id.toString()}>
                          {seminar.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Images (Optional)</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="image-upload"
                      className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                    >
                      <UploadCloud className="h-4 w-4" />
                      Upload Images
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                      multiple
                    />
                  </div>
                  
                  {currentAnnouncement.images && currentAnnouncement.images.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {currentAnnouncement.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square overflow-hidden rounded-md border">
                            <Image
                              src={getImageUrl(image)}
                              alt={`Preview ${index + 1}`}
                              width={100}
                              height={100}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute top-1 right-1 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.preventDefault();
                              removeImage(index);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
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
              
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" {...({} as ComponentProps<typeof Progress>)} />
                </div>
              )}
              
              <DialogFooter>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? "Creating..." : "Create Announcement"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Viewer Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(VIEWER_COLORS).map(([viewer, colors]) => (
          <Button
            key={viewer}
            variant={activeViewer === viewer ? 'default' : 'outline'}
            className={`${colors.text} ${activeViewer === viewer ? colors.bg : ''}`}
            onClick={() => {
              setActiveViewer(viewer as any);
              fetchAnnouncements(viewer);
            }}
          >
            {viewer.charAt(0).toUpperCase() + viewer.slice(1)}
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-500">No announcements found for {activeViewer}</p>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create a new announcement
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
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
                      {announcement.linked_title && ` (${announcement.linked_title})`}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDateDisplay(announcement.date)} at {announcement.time}
                    </span>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="animate-accordion-down">
                    {announcement.images && announcement.images.length > 0 && (
                      <div className="grid grid-cols-1 gap-4 p-4 border-t">
                        {announcement.images.map((image, index) => (
                          <div key={index} className="relative w-full h-64 rounded-md overflow-hidden border">
                            <Image
                              src={getImageUrl(image)}
                              alt={`${announcement.title} image ${index + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/placeholder-image.jpg';
                              }}
                            />
                          </div>
                        ))}
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
                          setCurrentAnnouncement({
                            ...announcement,
                            images: announcement.images || []
                          });
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
          })}
        </div>
      )}

      {/* Edit Announcement Modal */}
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
                  onValueChange={async (value) => {
                    const viewer = value as 'all' | 'member' | 'conference' | 'seminar' | 'speaker';
                    setCurrentAnnouncement({
                      ...currentAnnouncement,
                      viewer,
                      linked_id: ''
                    });

                    if (viewer === 'conference') {
                      await fetchConferences();
                    } else if (viewer === 'seminar') {
                      await fetchSeminars();
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="member">Members</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                    <SelectItem value="speaker">Speakers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-linked_id">
                  {currentAnnouncement.viewer === 'conference' ? 'Select Conference' : 
                   currentAnnouncement.viewer === 'seminar' ? 'Select Seminar' : 
                   'Linked Item'}
                </Label>
                <Select
                  value={currentAnnouncement.linked_id || "none"}
                  onValueChange={(value) => setCurrentAnnouncement({
                    ...currentAnnouncement, 
                    linked_id: value === "none" ? "" : value
                  })}
                  disabled={!['conference', 'seminar'].includes(currentAnnouncement.viewer || '') || isFetchingLinkedData}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      isFetchingLinkedData ? "Loading..." :
                      currentAnnouncement.viewer === 'conference' ? "Select a conference" :
                      currentAnnouncement.viewer === 'seminar' ? "Select a seminar" :
                      "Not applicable"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {currentAnnouncement.viewer === 'conference' && conferences.map((conference) => (
                      <SelectItem key={conference.id} value={conference.id.toString()}>
                        {conference.title}
                      </SelectItem>
                    ))}
                    {currentAnnouncement.viewer === 'seminar' && seminars.map((seminar) => (
                      <SelectItem key={seminar.id} value={seminar.id.toString()}>
                        {seminar.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Images</Label>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="edit-image-upload"
                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent"
                  >
                    <UploadCloud className="h-4 w-4" />
                    Upload Images
                  </Label>
                  <Input
                    id="edit-image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                    multiple
                  />
                </div>
                
                {currentAnnouncement.images && currentAnnouncement.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {currentAnnouncement.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square overflow-hidden rounded-md border">
                          <Image
                            src={getImageUrl(image)}
                            alt={`Preview ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage(index);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
            
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

{/* Success Modal */}
<Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
  <DialogContent className="sm:max-w-[425px] rounded-lg">
    <DialogHeader>
      <div className="flex justify-center">
        <div className="relative">
          {/* Animated checkmark circle */}
          <div className="w-16 h-16 bg-[#203a87]/10 rounded-full flex items-center justify-center mx-auto">
            {/* Checkmark animation */}
            <svg 
              className="w-12 h-12 text-[#203a87] animate-checkmark"
              viewBox="0 0 52 52" 
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="26" 
                cy="26" 
                r="25" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className="opacity-30"
              />
              <path 
                className="animate-checkmark-path"
                stroke="currentColor" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
                style={{
                  strokeDasharray: 50,
                  strokeDashoffset: 50,
                  animation: 'draw 0.6s ease-out forwards 0.2s'
                }}
              />
            </svg>
          </div>
        </div>
      </div>
      <DialogTitle className="text-center text-[#203a87] text-2xl mt-4 font-semibold">
        Success!
      </DialogTitle>
    </DialogHeader>
    
    <div className="text-center py-4 space-y-2 px-4">
      <p className="text-lg font-medium text-gray-800">{successMessage}</p>
      {currentAnnouncement.viewer && (
        <p className="text-gray-600">
          Announcement for <span className="font-semibold text-[#203a87] capitalize">{currentAnnouncement.viewer}</span> was created successfully.
        </p>
      )}
    </div>
    
    <DialogFooter className="flex justify-center pb-4">
      <Button 
        onClick={() => setIsSuccessModalOpen(false)}
        className="px-8 bg-[#203a87] hover:bg-[#1a2f6d] text-white transition-all duration-300 hover:shadow-md"
      >
        Close
      </Button>
    </DialogFooter>
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