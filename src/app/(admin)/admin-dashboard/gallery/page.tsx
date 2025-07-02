"use client"
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { showToast } from '@/utils/toast';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload, Pencil, X } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from 'next/navigation';

interface GalleryYear {
  year: string;
  cover: string;
}

interface GalleryImage {
  gallery_id: number;
  date: string;
  year: string;
  caption: string;
  image: string;
}

interface GalleryActivity {
  slug: string;
  activity: string;
}

interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}
const API_URL = process.env.NEXT_PUBLIC_API_URL;

const GalleryManagement = () => {
  const [years, setYears] = useState<GalleryYear[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: session } = useSession();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  
  // Upload form state
  const [uploadYear, setUploadYear] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Update form state
  const [updateYear, setUpdateYear] = useState("");
  const [updateCaption, setUpdateCaption] = useState("");
  const [activities, setActivities] = useState<GalleryActivity[]>([]);
  const [selectedActivitySlug, setSelectedActivitySlug] = useState<string>("");
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen] = useState(false);
  const [newActivityName, setNewActivityName] = useState("");

  const bearerToken = session?.user?.token || session?.user?.userData?.token;
  const router = useRouter();

  useEffect(() => {
    fetchGalleryYears();
  }, []);

  const fetchGalleryYears = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/landing/gallery`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gallery years');
      }

      const data: ApiResponse<GalleryYear[]> = await response.json();
      
      if (data.status === 'success') {
        setYears(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch gallery years');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching gallery years:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    
    // Generate previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prevPreviews => {
      // Clean up old previews
      prevPreviews.forEach(preview => URL.revokeObjectURL(preview));
      return newPreviews;
    });
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/list_gallery_activity/`, {
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'success') {
        setActivities(data.data);
      }
    } catch (err) {
      showToast.error('Failed to fetch activities');
    }
  };

  useEffect(() => {
    if (isUploadModalOpen) {
      fetchActivities();
    }
  }, [isUploadModalOpen]);

  const handleCreateActivity = async () => {
    if (!newActivityName) return;
    try {
      const response = await fetch(`${API_URL}/admin/create_gallery_activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activity: newActivityName }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        showToast.success('Activity created');
        setIsCreateActivityModalOpen(false);
        setNewActivityName("");
        fetchActivities();
      } else {
        showToast.error(data.message || 'Failed to create activity');
      }
    } catch (err) {
      showToast.error('Failed to create activity');
    }
  };

  const handleUpload = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('year', uploadYear);
      formData.append('activity_slug', selectedActivitySlug);
      formData.append('caption', uploadCaption);
      selectedFiles.forEach(file => {
        formData.append('gallery[]', file);
      });
      const response = await fetch(`${API_URL}/admin/upload_gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to upload gallery');
      }
      const data = await response.json();
      if (data.status === 'success') {
        setIsUploadModalOpen(false);
        clearUploadForm();
        fetchGalleryYears();
        showToast.success('Gallery uploaded successfully');
      } else {
        throw new Error(data.message || 'Failed to upload gallery');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      showToast.error('Error uploading gallery:');
    } finally {
      setIsLoading(false);
    }
  };

  const clearUploadForm = () => {
    setUploadYear("");
    setUploadCaption("");
    setSelectedFiles([]);
    setPreviews([]);
  };

  const handleDelete = async (galleryId: number) => {
    // if (!confirm('Are you sure you want to delete this image?')) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/delete_gallery_image`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gallery_id: galleryId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete gallery image');
        showToast.error('Failed to delete gallery image');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        showToast.success('Gallery image deleted successfully');
      } else {
        throw new Error(data.message || 'Failed to delete gallery image');
        showToast.error(data.message || 'Failed to delete gallery image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error deleting gallery image:', err);
      showToast.error('Error deleting gallery image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedImage) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/admin/update_gallery_info`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gallery_id: selectedImage.gallery_id,
          year: updateYear,
          caption: updateCaption,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update gallery info');
        showToast.error('Failed to update gallery info');
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        showToast.success('Gallery info updated successfully');
        setIsUpdateModalOpen(false);
      } else {
        throw new Error(data.message || 'Failed to update gallery info');
        showToast.error(data.message || 'Failed to update gallery info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error updating gallery info:', err);
      showToast.error('Error updating gallery info');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {error && (
        <Alert variant="error" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gallery Management</h1>
        <Button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <Upload size={16} />
          Upload Gallery
        </Button>
      </div>

      {isLoading && !years.length && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {years.map((year) => (
          <Card 
            key={year.year}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/admin-dashboard/gallery/${year.year}`)}
          >
            <CardHeader>
              <CardTitle>Year {year.year}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={year.cover}
                alt={`Gallery ${year.year}`}
                className="w-full h-48 object-cover rounded-md"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      <Dialog open={isUploadModalOpen} onOpenChange={(open) => {
        setIsUploadModalOpen(open);
        if (!open) clearUploadForm();
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Gallery Images</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={uploadYear}
                onChange={(e) => setUploadYear(e.target.value)}
                placeholder="2024"
              />
            </div>
            <div>
              <Label htmlFor="activity">Activity</Label>
              <div className="flex gap-2 items-center">
                <Select
                  value={selectedActivitySlug}
                  onValueChange={setSelectedActivitySlug}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    {activities.map((activity) => (
                      <SelectItem key={activity.slug} value={activity.slug}>
                        {activity.activity}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="sm" onClick={() => setIsCreateActivityModalOpen(true)}>
                  + New
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={uploadCaption}
                onChange={(e) => setUploadCaption(e.target.value)}
                placeholder="Conference 2024"
              />
            </div>
            <div>
              <Label htmlFor="images">Images</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-2"
              />
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {previews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                      onClick={() => {
                        setPreviews(prev => prev.filter((_, i) => i !== index));
                        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
                      }}
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsUploadModalOpen(false);
                clearUploadForm();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={isLoading || !uploadYear || !uploadCaption || !selectedFiles.length || !selectedActivitySlug}
            >
              {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Gallery Info</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="updateYear">Year</Label>
              <Input
                id="updateYear"
                value={updateYear}
                onChange={(e) => setUpdateYear(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="updateCaption">Caption</Label>
              <Input
                id="updateCaption"
                value={updateCaption}
                onChange={(e) => setUpdateCaption(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsUpdateModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isLoading || !updateYear || !updateCaption}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Activity Modal */}
      <Dialog open={isCreateActivityModalOpen} onOpenChange={setIsCreateActivityModalOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Create New Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="new-activity">Activity Name</Label>
              <Input
                id="new-activity"
                value={newActivityName}
                onChange={(e) => setNewActivityName(e.target.value)}
                placeholder="e.g. 2025 Stakeholders meeting"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCreateActivityModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateActivity} disabled={!newActivityName}>
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GalleryManagement;